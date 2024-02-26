package it.polito.bigdata.spark.example;

import org.apache.spark.api.java.*;
import org.apache.spark.SparkConf;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;

import scala.Tuple2;
	
public class SparkDriver {
	
	public static void main(String[] args) {

		// The following two lines are used to switch off some verbose log messages
		Logger.getLogger("org").setLevel(Level.OFF);
		Logger.getLogger("akka").setLevel(Level.OFF);


		String inputPathStations;
		String inputPathStationsOccupancy;
		String outputPath1;
		String outputPath2;
		
		inputPathStations=args[0];
		inputPathStationsOccupancy = args[1];
		outputPath1=args[2];
		outputPath2=args[3];

	
		// Create a configuration object and set the name of the application
		SparkConf conf=new SparkConf().setAppName("Spark Lab #5").setMaster("local");
		
		// Use the following command to create the SparkConf object if you want to run
		// your application inside Eclipse.
		// Remember to remove .setMaster("local") before running your application on the cluster
		// SparkConf conf=new SparkConf().setAppName("Spark Lab #5").setMaster("local");
		
		// Create a Spark Context object
		JavaSparkContext sc = new JavaSparkContext(conf);

		// print the application ID
		System.out.println("******************************");
		System.out.println("ApplicationId: "+JavaSparkContext.toSparkContext(sc).applicationId());
		System.out.println("******************************");
		

		// Task 1 - Select the list of potential critical small stations

		// 1. Read the first file
		JavaRDD<String> stations = sc.textFile(inputPathStations);

		// 2. Filter only small stations
		JavaRDD<String> smallStations = stations.filter( station -> {
			String[] fields = station.split(",");
			Integer totalNumberOfSlots = Integer.parseInt((fields[4]));
			if(totalNumberOfSlots<5){
				return true;
			}
			else{ 
				return false;
			}
		});

		// 3. Select only ids of small stations
		JavaRDD<String> smallStations_ids = smallStations.map(station -> {
			String[] fields = station.split(",");
			return fields[0];
		});

		// 4. Read the second file
		JavaRDD<String> stationsOccupancy = sc.textFile(inputPathStationsOccupancy).cache();

		// 5. Filter potential critical stations
		JavaRDD<String> potentialCriticalStations = stationsOccupancy.filter(station -> {
			String[] fields = station.split(",");
			Integer numFreeSlots = Integer.parseInt(fields[5]);
			if(numFreeSlots==0){
				return true;
			}
			else{
				return false;
			}
		});

		// 6. Select only ids of potential critical stations
		JavaRDD<String> potencialCriticalStations_ids = potentialCriticalStations.map(station -> {
			String fields[] = station.split(",");
			return fields[0];
		});

		// 7. Make the intersection of the two JavaRDD to obtain potencial critical small stations
		JavaRDD<String> result = smallStations_ids.intersection(potencialCriticalStations_ids);

		result.saveAsTextFile(outputPath1);
		

		// Task 2 - Select the list of well-sized stations
		
		// 1. Create java pairs
		JavaPairRDD<String, FreeSlotsCounter> stations_occupancy = stationsOccupancy.mapToPair(station -> {
			String fields[] = station.split(",");
			Integer free_slots = Integer.parseInt(fields[5]);
			FreeSlotsCounter fsc = new FreeSlotsCounter();
			if(free_slots>=3){
				fsc.freeSlotsGreatherThan3=true;
			}
			else{
				fsc.freeSlotsGreatherThan3=false;
			}
			
			return new Tuple2<String, FreeSlotsCounter>(fields[0],fsc);
 		});

		// 2. Reduce by key
		JavaPairRDD<String, FreeSlotsCounter> wellSizedStations = stations_occupancy.reduceByKey((s1,s2)->{
			FreeSlotsCounter fsc = new FreeSlotsCounter();
			fsc.freeSlotsGreatherThan3 = s1.freeSlotsGreatherThan3&&s2.freeSlotsGreatherThan3;
			return fsc;
		});

		// 3. Filter only well-sized stations
		JavaPairRDD<String, FreeSlotsCounter> result2 = wellSizedStations.filter(station ->{
			if(station._2().freeSlotsGreatherThan3==true){
				return true;
			}
			else{
				return false;
			}
		});

		// 3. Selects only ids
		result2.keys().saveAsTextFile(outputPath2);
	
		// Close the Spark context
		sc.close();
	}
}
