package it.polito.bigdata.spark.example;

import org.apache.spark.api.java.*;

import scala.Tuple2;

import org.apache.spark.SparkConf;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
	
public class SparkDriver {
	
	public static void main(String[] args) {

		// The following two lines are used to switch off some verbose log messages
		Logger.getLogger("org").setLevel(Level.OFF);
		Logger.getLogger("akka").setLevel(Level.OFF);


		String inputPath;
		String outputPath1;
		String outputPath2;
		Double PM10th_limit;
		Double PM2_5th_limit;
		
		inputPath=args[0];
		outputPath1=args[1];
		outputPath2 = args[2];
		PM10th_limit = Double.parseDouble(args[3]);
		PM2_5th_limit = Double.parseDouble(args[4]);

	
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

		// Task 1 - Select the list of highly polluted stations

		// 1. Read the file
		JavaRDD<String> monitoringStations = sc.textFile(inputPath);

		// 2. filter reading for year 2015
		JavaRDD<String> monitoringStation2015 = monitoringStations.filter(reading -> {
			String[] fields = reading.split(",");
			String date = fields[1];
			if(date.startsWith("2015")){
				return true;
			}
			else{
				return false;
			}
		});

		// 3. Create pairs <String, Integer>(station_id, 1) for stations with PM10 value above the threshold
		JavaPairRDD<String, Integer> stationsPollutions = monitoringStation2015.mapToPair(reading -> {
			String[] fields = reading.split(",");
			Double PM10_value = Double.parseDouble(fields[4]);
			int polluted=0;
			if(PM10_value>PM10th_limit){
				polluted = 1;
			}
			return new Tuple2<String, Integer>(fields[0], polluted);
		});

		// 4. Reduce by key
		JavaPairRDD<String, Integer> stationsPollution = stationsPollutions.reduceByKey((r1,r2) -> {
			int sum = r1+r2;
			return sum;
		});

		// 5. Filter highly polluted stations
		JavaPairRDD<String, Integer> highlyPollutedStations = stationsPollution.filter(reading -> {
			if(reading._2()>45){
				return true;
			}
			else{
				return false;
			}
		});

		// 6. Select only ids
		highlyPollutedStations.keys().saveAsTextFile(outputPath1);
		
		// Task 2 - Select the list of always polluted stations.

		JavaPairRDD<String, Integer> stationsWithPollutions = monitoringStations.mapToPair(reading -> {
			String[] fields = reading.split(",");
			Double PM2_5_value = Double.parseDouble(fields[5]);
			int sum=0;
			if(PM2_5_value<PM2_5th_limit){
				sum = 1;
			}
			return new Tuple2<String,Integer>(fields[0], sum);
		});

		JavaPairRDD<String, Integer> stationsWithPollutionsReduced = stationsWithPollutions.reduceByKey((r1,r2) -> {
			return r1+r2;
		});

		JavaPairRDD<String,Integer> alwaysPollutedStations = stationsWithPollutionsReduced.filter(station -> {
			if(station._2()==0){
				return true;
			}
			else{
				return false;
			}
		});

		alwaysPollutedStations.keys().saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
