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

		String inputPathBycicles;
		String inputPathByciclesFailures;
		String outputPath1;
		String outputPath2;

		inputPathBycicles = args[0];
		inputPathByciclesFailures = args[1];
		outputPath1 = args[2];
		outputPath2 = args[3];
	
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
		

		// Task 1
		JavaRDD<String> bicycleFailures = sc.textFile(inputPathByciclesFailures);

		JavaRDD<String> bicycleFailures2018 = bicycleFailures.filter(line->{
			String[] fields = line.split(",");
			String date = fields[0];
			if(date.startsWith(("2018"))){
				return true;
			}
			else{
				return false;
			}
		}).cache();

		JavaRDD<String> bicycleWheelFailures2018 = bicycleFailures2018.filter(line->{
			String[] fields = line.split(",");
			String component = fields[2];
			if(component.compareTo("Wheel")==0){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, Integer> bid_month_ones = bicycleWheelFailures2018.mapToPair(line->{
			String[] fields = line.split(",");
			String date = fields[0];
			String month = date.split("/")[1];
			String bid = fields[1];
			return new Tuple2<String, Integer>(bid+"-"+month, 1);
		});

		JavaPairRDD<String, Integer> bid_month_sum = bid_month_ones.reduceByKey((num1, num2)-> num1+num2);

		JavaPairRDD<String, Integer> bid_requirementRespected = bid_month_sum.mapToPair(pair -> {
			String bid = pair._1().split("-")[0];
			if(pair._2()>2){
				return new Tuple2<String, Integer>(bid, 1);
			}
			else{
				return new Tuple2<String, Integer>(bid, 0);
			}
		});

		JavaPairRDD<String, Integer> bid_requirementRespected_aggregated = bid_requirementRespected.reduceByKey((num1, num2)->num1+num2);

		JavaPairRDD<String, Integer> criticalBicycles = bid_requirementRespected_aggregated.filter(pair -> pair._2()>0);

		criticalBicycles.keys().saveAsTextFile(outputPath1);

		// Task 2
		JavaRDD<String> bicycles = sc.textFile(inputPathBycicles);

		JavaPairRDD<String, String> bids_cities = bicycles.mapToPair(line->{
			String fields[] = line.split(",");
			String bid = fields[0];
			String city = fields[2];
			return new Tuple2<String, String>(bid,city);
		});

		// Compute number of failures for each bycicle in 2018
		JavaPairRDD<String, Integer> bid_ones = bicycleFailures2018.mapToPair(line->{
			String[] fields = line.split(",");
			String bid = fields[1];
			return new Tuple2<String,Integer>(bid,1);
		});

		JavaPairRDD<String, Integer> bid_numFailures = bid_ones.reduceByKey((num1,num2)-> num1+num2);

		JavaPairRDD<String,Integer> bid_numFailuresGreatherThan20 = bid_numFailures.filter(pair -> pair._2()>20);

		JavaPairRDD<String, Tuple2<Integer, String>> bid_numFailure_city = bid_numFailuresGreatherThan20.join(bids_cities);

		JavaRDD<String> citiesToBeRemoved = bid_numFailure_city.map(pair->pair._2()._2());

		JavaRDD<String> allCities = bicycles.map(line->{
			String fields[] = line.split(",");
			String city = fields[2];
			return city;
		}).distinct();

		JavaRDD<String> resultCities = allCities.subtract(citiesToBeRemoved).cache();

		resultCities.saveAsTextFile(outputPath2);

		System.out.println("Number of cities found: "+resultCities.count());

		// Close the Spark context
		sc.close();
	}
}
