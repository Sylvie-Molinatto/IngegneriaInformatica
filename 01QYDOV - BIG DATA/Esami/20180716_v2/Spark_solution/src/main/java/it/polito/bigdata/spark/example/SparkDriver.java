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

		String inputPathFaults;
		String inputPathRobots;
		String outputPath1;
		String outputPath2;

		inputPathFaults = args[0];
		inputPathRobots = args[1];
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
		JavaRDD<String> robots = sc.textFile(inputPathRobots);

		JavaPairRDD<String, String> robotIdsPlantId = robots.mapToPair(line->{
			String fields[] = line.split(",");
			String robot_id = fields[0];
			String plant_id = fields[1];
			return new Tuple2<String,String>(robot_id, plant_id);
		});

		JavaRDD<String> faults = sc.textFile(inputPathFaults);
		
		JavaRDD<String> faultsFiltered = faults.filter(line->{
			String[] fields = line.split(",");
			String date = fields[3];
			if(date.compareTo("2015/01/01")>=0 && date.compareTo("2015/06/30")<=0){
				return true;
			}
			else{
				return false;
			}
		}).cache();

		JavaPairRDD<String, Integer> robotsId_ones = faultsFiltered.mapToPair(line -> {
			String[] fields = line.split(",");
			String robotId = fields[0];
			return new Tuple2<String, Integer>(robotId, 1);
		});

		JavaPairRDD<String, Integer> robotIds_faultsNumber = robotsId_ones.reduceByKey((num1, num2)->{
			return num1+num2;
		});

		JavaPairRDD<String, Tuple2<String, Integer>> robotIdsPlantsIds_faultsNumber= robotIdsPlantId.join(robotIds_faultsNumber);

		JavaPairRDD<String, Integer> plantIds_faultsNumber = robotIdsPlantsIds_faultsNumber.mapToPair(pair->{
			String plantId = pair._2()._1();
			Integer num_faults = pair._2()._2();
			return new Tuple2<String, Integer>(plantId,num_faults);
		});

		JavaPairRDD<String, Integer> plantIds_faultsNumber_aggregated = plantIds_faultsNumber.reduceByKey((num1, num2)-> num1+num2);

		JavaPairRDD<String, Integer> plantIds_faltsNumber_aggregated_filtered = plantIds_faultsNumber_aggregated.filter(pair -> pair._2()>180);

		plantIds_faltsNumber_aggregated_filtered.saveAsTextFile(outputPath1);


		// Task 2

		JavaPairRDD<String, Requirements> robotId_month_requirements = faultsFiltered.mapToPair(line->{
			String[] fields = line.split(",");
			String robotId = fields[0];
			String date = fields[3];
			int duration = Integer.parseInt(fields[2]);
			String month = date.split("/")[1];
			int numFaultWithLongDuration = 0;
			if(duration>120){
				numFaultWithLongDuration = 1;
			}
			Requirements r = new Requirements(1, numFaultWithLongDuration,0);
			return new Tuple2<String, Requirements>(robotId+"-"+month, r);
		});

		JavaPairRDD<String, Requirements> robotId_month_requirements_aggregated = robotId_month_requirements.reduceByKey((r1,r2)->{
			Requirements r = new Requirements(r1.numFaultMonth+r2.numFaultMonth, r1.numFaultWithLongDuration+r2.numFaultWithLongDuration, 0);
			return r;
		});

		JavaPairRDD<String, Requirements> robotId_requirements = robotId_month_requirements_aggregated.mapToPair(pair ->{
			String robotId_month = pair._1();
			String robotId = robotId_month.split("-")[0];
			int numMonths = 0;
			if(pair._2().numFaultMonth>=5){
				numMonths = 1;
			}
			Requirements r = new Requirements(pair._2().numFaultMonth, pair._2().numFaultWithLongDuration, numMonths);
			return new Tuple2<String, Requirements>(robotId, r);
		});

		JavaPairRDD<String, Requirements> robotId_requirements_aggregated = robotId_requirements.reduceByKey((r1,r2)-> {
			Requirements r = new Requirements(r1.numFaultMonth+r2.numFaultMonth, r1.numFaultWithLongDuration+r2.numFaultWithLongDuration, r1.numMonths+r2.numMonths);
			return r;
		});

		JavaPairRDD<String, Requirements> robotId_requirements_aggregated_filtered = robotId_requirements_aggregated.filter(pair->{
			if(pair._2().numMonths==6 && pair._2().numFaultWithLongDuration>=1){
				return true;
			}
			else{
				return false;
			}
		});

		robotId_requirements_aggregated_filtered.keys().saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
