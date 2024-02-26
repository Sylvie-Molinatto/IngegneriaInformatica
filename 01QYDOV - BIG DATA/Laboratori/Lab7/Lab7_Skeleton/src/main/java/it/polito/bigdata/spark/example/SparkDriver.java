package it.polito.bigdata.spark.example;

import scala.Tuple2;

import org.apache.spark.api.java.*;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.spark.SparkConf;

public class SparkDriver {

	public static void main(String[] args) {

		// The following two lines are used to switch off some verbose log messages
		Logger.getLogger("org").setLevel(Level.OFF);
		Logger.getLogger("akka").setLevel(Level.OFF);

		String inputPath;
		String inputPath2;
		Double threshold;
		String outputFolder;

		inputPath = args[0];
		inputPath2 = args[1];
		threshold = Double.parseDouble(args[2]);
		outputFolder = args[3];

		// Create a configuration object and set the name of the application
		SparkConf conf = new SparkConf().setAppName("Spark Lab #7");

		// Use the following command to create the SparkConf object if you want to run
		// your application inside Eclipse.
		// SparkConf conf=new SparkConf().setAppName("Spark Lab #7").setMaster("local");

		// Create a Spark Context object
		JavaSparkContext sc = new JavaSparkContext(conf);

		// print the application ID
		System.out.println("******************************");
		System.out.println("ApplicationId: "+JavaSparkContext.toSparkContext(sc).applicationId());
		System.out.println("******************************");

		JavaRDD<String> firstInputRDD = sc.textFile(inputPath);

		// Remove first line (header)
		JavaRDD<String> filteredRDD = firstInputRDD.filter(line -> {
			if (line.startsWith("station")){
				return false;
			}
			else{
				String[] fields = line.split("\\t");
				int used_slots = Integer.parseInt(fields[2]);
				int free_slots = Integer.parseInt(fields[3]);
				if(free_slots!=0 || used_slots!=0){
					return true;
				}
				else{
					return false;
				}
			}
		});

		// Create a PairRDD with key = stationId_DayOfTheWeek_Hour and value = (1,1) station full or (1,0) not full
		JavaPairRDD<String, Tuple2<Integer, Integer>> stationDayHourRDD = filteredRDD.mapToPair(line -> {
			String[] fields = line.split("\\t");
			String stationId = fields[0];
			String timestamp = fields[1];
			String dayOfTheWeek = DateTool.DayOfTheWeek(timestamp.split(" ")[0]);
			String hour = timestamp.split(" ")[1].split(":")[0];
			int free_slots = Integer.parseInt(fields[3]);
			int full = 0;
			if(free_slots==0){
				full = 1;
			}
			return new Tuple2<String, Tuple2<Integer, Integer>>(stationId+"_"+dayOfTheWeek+"_"+hour, new Tuple2<Integer, Integer>(1, full));
		});

		// Count the total number of readings and 'full' readings for each stationId_DayOfTheWeek_Hour
		JavaPairRDD<String, Tuple2<Integer, Integer>> stationDayHourCountsRDD = stationDayHourRDD.reduceByKey(
			(x,y) ->  new Tuple2<Integer, Integer>(x._1()+y._1(), x._2()+y._2()));

		// Compute criticality for each stationId_DayOfTheWeek_Hour
		JavaPairRDD<String, Double> criticalityRDD = stationDayHourCountsRDD.mapValues(
			x -> (double)x._2()/ (double)x._1());

		// criticalityRDD.saveAsTextFile(outputFolder);

		// Select only criticality values above the threshold
		JavaPairRDD<String, Double> criticalityAboveThresholdRDD = criticalityRDD.filter(
			x -> x._2() > threshold);

		// criticalityAboveThresholdRDD.saveAsTextFile(outputFolder);

		// New pair<(station_id, (DayOfTheWeekHourCriticality))>
		JavaPairRDD<String, DayOfWeekHourCriticality> stationsTimeSlotCriticalityRDD = 
		criticalityAboveThresholdRDD.mapToPair( (prev) -> {
			String[] fields = prev._1().split("_");
			String stationId = fields[0];
			String dayWeek = fields[1];
			String hour = fields[2];
			Double criticality = prev._2();
			return new Tuple2<String, DayOfWeekHourCriticality>(stationId, new DayOfWeekHourCriticality(dayWeek, hour, criticality));
		});

		// Selects the most critical timeslot for each station
		/* If there are two or more timeslots characterized by the highest criticality value for the same station,
		select only one of those timeslots. Specifically, select the one associated with the
		earliest hour. If also the hour is the same, consider the lexicographical order of the name of the week day. */

		JavaPairRDD<String, DayOfWeekHourCriticality> mostCriticalTimeSlotRDD = 
		stationsTimeSlotCriticalityRDD.reduceByKey( (value1, value2) -> {
			if(value1.criticality>value2.criticality){
				return new DayOfWeekHourCriticality(value1.dayOfWeek, value1.hour, value1.criticality);
			}
			else if(value1.criticality==value2.criticality){
				Integer hour1 = Integer.parseInt(value1.hour);
				Integer hour2 = Integer.parseInt(value2.hour);
				if(hour1 < hour2){
					return new DayOfWeekHourCriticality(value1.dayOfWeek, value1.hour, value1.criticality);
				}
				else if(hour1==hour2){
					if(value1.dayOfWeek.compareTo(value2.dayOfWeek)<0){
						return new DayOfWeekHourCriticality(value1.dayOfWeek, value1.hour, value1.criticality);
					}
					else{
						return new DayOfWeekHourCriticality(value2.dayOfWeek, value2.hour, value2.criticality);
					}
				}
				else{
					return new DayOfWeekHourCriticality(value2.dayOfWeek, value2.hour, value2.criticality);
				}
			}
			else{
				return new DayOfWeekHourCriticality(value2.dayOfWeek, value2.hour, value2.criticality);
			}
		});

		// mostCriticalTimeSlotRDD.saveAsTextFile(outputFolder);

		// Read the location of the stations
		JavaPairRDD<String, String> stationLocation = sc.textFile(inputPath2).mapToPair(line -> {
			// id latitude longitude name
			// 1 41.397978 2.180019 Gran Via Corts Catalanes
			String[] fields = line.split("\\t");

			return new Tuple2<String, String>(fields[0], fields[1] + "," + fields[2]);
		});

		// Join the locations with the "critical" stations
		JavaPairRDD<String, Tuple2<DayOfWeekHourCriticality, String>> resultLocations = 
				mostCriticalTimeSlotRDD.join(stationLocation);


		// resultLocations.saveAsTextFile(outputFolder);

		// Create a string containing the description of a marker, in the KML
		// format, for each sensor and the associated information
		JavaRDD<String> resultKML = resultLocations
				.map((Tuple2<String, Tuple2<DayOfWeekHourCriticality, String>> StationMax) -> {

					String stationId = StationMax._1();

					DayOfWeekHourCriticality dWHC = StationMax._2()._1();
					String coordinates = StationMax._2()._2();

					String result = "<Placemark><name>" + stationId + "</name>" + "<ExtendedData>"
							+ "<Data name=\"DayWeek\"><value>" + dWHC.dayOfWeek + "</value></Data>"
							+ "<Data name=\"Hour\"><value>" + dWHC.hour + "</value></Data>"
							+ "<Data name=\"Criticality\"><value>" + dWHC.criticality + "</value></Data>"
							+ "</ExtendedData>" + "<Point>" + "<coordinates>" + coordinates + "</coordinates>"
							+ "</Point>" + "</Placemark>";

					return result;
				});
		  
		// Invoke coalesce(1) to store all data inside one single partition/i.e., in one single output part file
		resultKML.coalesce(1).saveAsTextFile(outputFolder); 

		// Close the Spark context
		sc.close();
	}
}
