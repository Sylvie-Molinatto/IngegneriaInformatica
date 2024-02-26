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

		String inputPathAppliedPatches;
		String inputPathPatches;
		String inputPathServer;
		String outputPath1;
		String outputPath2;

		inputPathAppliedPatches = args[0];
		inputPathPatches = args[1];
		inputPathServer = args[2];
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
		JavaRDD<String> patches = sc.textFile(inputPathPatches);

		JavaRDD<String> patchesFiltered = patches.filter(line->{
			String[] fields = line.split(",");
			String operatingSystem = fields[2];
			if(operatingSystem.equals("Ubuntu2")){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, String> patchesFiltered_releaseDate = patchesFiltered.mapToPair(line->{
			String fields[] = line.split(",");
			String pid = fields[0];
			String release_date = fields[1];
			return new Tuple2<String, String>(pid, release_date);
		});

		JavaRDD<String> appliedPatches = sc.textFile(inputPathAppliedPatches).cache();

		JavaPairRDD<String, String> appliedPatches_applicationDate = appliedPatches.mapToPair(line->{
			String[] fields = line.split(",");
			String pid = fields[0];
			String applicationDate = fields[2];
			return new Tuple2<String, String>(pid, applicationDate);
		});

		JavaPairRDD<String, Tuple2<String, String>> pid_releaseDate_applicationDate = patchesFiltered_releaseDate.join(appliedPatches_applicationDate);

		JavaPairRDD<String, Tuple2<String, String>> pid_appliedOnReleaseDate = pid_releaseDate_applicationDate.filter(pair -> {
			String release_date = pair._2()._1();
			String application_date = pair._2()._2();
			if(release_date.equals(application_date)){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, Integer> pid_appliedOnReleaseDate_ones = pid_appliedOnReleaseDate.mapToPair(pair ->{
			String pid = pair._1();
			return new Tuple2<String, Integer>(pid,1);
		});

		JavaPairRDD<String, Integer> pid_appliedOnReleaseDate_count = pid_appliedOnReleaseDate_ones.reduceByKey((num1,num2)->num1+num2);

		JavaPairRDD<String, Integer> pid_appliedOnReleaseDate_moreThan2 = pid_appliedOnReleaseDate_count.filter(pair -> pair._2()>=2);
		
		pid_appliedOnReleaseDate_moreThan2.keys().saveAsTextFile(outputPath1);

		// Task 2
		JavaRDD<String> appliedPatches2021 = appliedPatches.filter(line->{
			String[] fields = line.split(",");
			String date = fields[2];
			if(date.startsWith("2021")){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, Integer> sid_month_ones = appliedPatches2021.mapToPair(line -> {
			String[] fields = line.split(",");
			String sid = fields[1];
			String date = fields[2];
			String month = date.split("/")[1];
			return new Tuple2<String, Integer>(sid+"-"+month, 1);
		}).distinct();

		JavaPairRDD<String, Integer> sid_ones = sid_month_ones.mapToPair(pair->{
			String sid_month = pair._1();
			String sid = sid_month.split("-")[0];
			return new Tuple2<String, Integer>(sid, 1);
		});

		JavaPairRDD<String, Integer> sid_numMonthAppliedPatches = sid_ones.reduceByKey((num1, num2)-> num1+num2);

		JavaPairRDD<String, Integer> sid_numMonthNonAppliedPatches = sid_numMonthAppliedPatches.mapToPair(pair->{
			int numMonth = 12-pair._2();
			return new Tuple2<String, Integer>(pair._1(), numMonth);
		});

		JavaRDD<String> serverIds = sc.textFile(inputPathServer).map(line->{
			String fields[] = line.split(",");
			return fields[0];
		});

		JavaPairRDD<String, Integer> serverWithoutPatchesIn2021 = serverIds.subtract(sid_numMonthNonAppliedPatches.keys()).mapToPair(sid ->{
			return new Tuple2<String, Integer>(sid,12);
		});

		JavaPairRDD<String, Integer> result = sid_numMonthNonAppliedPatches.union(serverWithoutPatchesIn2021);

		result.saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
