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

		String inputPathFailures;
		String inputPathProductionPlants;
		String inputPathRobots;
		String outputPath1;
		String outputPath2;

		inputPathFailures = args[0];
		inputPathProductionPlants = args[1];
		inputPathRobots = args[2];
		outputPath1 = args[3];
		outputPath2 = args[4];

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
		JavaRDD<String> failures = sc.textFile(inputPathFailures);

		JavaRDD<String> failures2020 = failures.filter(line->{
			String[] fields = line.split(",");
			String date = fields[2];
			if(date.startsWith("2020")){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, Integer> rid_numFailures = failures2020.mapToPair(line->{
			String[] fields = line.split(",");
			String rid = fields[0];
			return new Tuple2<String, Integer>(rid, 1);
		});
		
		JavaPairRDD<String, Integer> rid_numFailuresTot = rid_numFailures.reduceByKey((num1,num2)-> num1+num2);

		JavaRDD<String> robots = sc.textFile(inputPathRobots);

		JavaPairRDD<String, String> rid_plantID = robots.mapToPair(line->{
			String fields[] = line.split(",");
			String rid = fields[0];
			String plantId = fields[1];
			return new Tuple2<String, String>(rid, plantId);
		}).cache();

		// (rid, (plantid, numFailures))
		JavaPairRDD<String, Tuple2<String, Integer>> rid_plantId_numFailures = rid_plantID.join(rid_numFailuresTot).cache();

		JavaPairRDD<String, Tuple2<String,Integer>> rid_plantId_numFailuresGreatherThan50 = rid_plantId_numFailures.filter(pair-> pair._2()._2()>=50);
		
		JavaRDD<String> resultPlantsId = rid_plantId_numFailuresGreatherThan50.map(pair->pair._2()._1()).distinct();

		resultPlantsId.saveAsTextFile(outputPath1);

		// Task 2
		// (rid, (plantid, numFailures)))
		JavaPairRDD<String, Integer> plantId_ones = rid_plantId_numFailures.mapToPair(pair->{
			String plant_id = pair._2()._1();
			return new Tuple2<String, Integer>(plant_id, 1);
		});

		// List of plants with failed robots
		JavaPairRDD<String, Integer> plantId_NumRobotFailed = plantId_ones.reduceByKey((num1,num2)->num1+num2);

		JavaRDD<String> productionPlants = sc.textFile(inputPathProductionPlants);

		JavaPairRDD<String,Integer> productionPlants_zeros = productionPlants.mapToPair(line->{
			String fields[] = line.split(",");
			String plantID = fields[0];
			return new Tuple2<String, Integer>(plantID, 0);
		});

		JavaPairRDD<String, Integer> productionPlantsWithoutFailedRobots = productionPlants_zeros.subtractByKey(plantId_NumRobotFailed);

		JavaPairRDD<String, Integer> result = plantId_NumRobotFailed.union(productionPlantsWithoutFailedRobots);

		result.saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
