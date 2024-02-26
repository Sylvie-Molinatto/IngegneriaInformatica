package it.polito.bigdata.spark.example;

import org.apache.spark.api.java.*;
import org.apache.spark.SparkConf;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import scala.Tuple2;
	
public class SparkDriver {
	
	public static void main(String[] args) {

		// The following two lines are used to switch off some verbose log messages
		Logger.getLogger("org").setLevel(Level.OFF);
		Logger.getLogger("akka").setLevel(Level.OFF);

		String inputPath;
		String outputPath1;
		String outputPath2;

		inputPath = args[0];
		outputPath1 = args[1];
		outputPath2 = args[2];

	
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
		JavaRDD<String> patches = sc.textFile(inputPath).cache();

		JavaRDD<String> patchesFiltered = patches.filter(line->{
			String[] fields = line.split(",");
			String date = fields[1];
			String application = fields[2];
			if(date.startsWith("2017") && (application.contains("Windows") || application.contains("Ubuntu"))){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, Integer> application_month_ones = patchesFiltered.mapToPair(line->{
			String[] fields = line.split(",");
			String date = fields[1];
			String month = date.split("/")[1];
			String application = fields[2];
			return new Tuple2<String, Integer>(application+"-"+month, 1);
		});

		JavaPairRDD<String, Integer> application_month_sumPatches = application_month_ones.reduceByKey((p1,p2)->p1+p2);

		JavaPairRDD<String, NumPatchesApplication> month_sumPatches = application_month_sumPatches.mapToPair(pair->{
			String application_month = pair._1();
			String application = application_month.split("-")[0];
			String month = application_month.split("-")[1];
			NumPatchesApplication npa = new NumPatchesApplication(pair._2(), application);
			return new Tuple2<String, NumPatchesApplication>(month, npa);
		});

		JavaPairRDD<String, NumPatchesApplication> month_max_sumPatches = month_sumPatches.reduceByKey((npa1,npa2)->{
			if(npa1.numPatches>npa2.numPatches){
				return new NumPatchesApplication(npa1.numPatches, npa1.application);
			}
			else if(npa2.numPatches>npa1.numPatches){
				return new NumPatchesApplication(npa2.numPatches, npa2.application);
			}
			else{
				return null;
			}
		});

		JavaPairRDD<String, NumPatchesApplication> month_max_sumPatches_filtered = month_max_sumPatches.filter(pair->pair._2()!=null);
		
		month_max_sumPatches_filtered.saveAsTextFile(outputPath1);

		// Task 2
		JavaRDD<String> patches2018 = patches.filter(line->{
			String[] fields = line.split(",");
			String date = fields[1];
			if(date.startsWith("2018")){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<ApplicationMonth, Integer> app_month_ones = patches2018.mapToPair(line->{
			String[] fields = line.split(",");
			String date = fields[1];
			int month = Integer.parseInt(date.split("/")[1]);
			String application = fields[2];
			ApplicationMonth am = new ApplicationMonth(application, month);
			return new Tuple2<ApplicationMonth, Integer>(am, 1);
		});

		JavaPairRDD<ApplicationMonth, Integer> app_month_sum = app_month_ones.reduceByKey((num1, num2)->new Integer(num1+num2));

		JavaPairRDD<ApplicationMonth, Integer> app_month_sum_filtered = app_month_sum.filter(pair->pair._2()>=4);

		JavaPairRDD<ApplicationMonth, Integer> windowElements_ones = app_month_sum_filtered.flatMapToPair(pair->{
			String application = pair._1().application;
			int month = pair._1().month;

			List<Tuple2<ApplicationMonth, Integer>> results = new ArrayList<Tuple2<ApplicationMonth, Integer>>();
			results.add(new Tuple2<ApplicationMonth,Integer>(pair._1(), 1));

			if(month-1>0){
				results.add(new Tuple2<ApplicationMonth,Integer>(new ApplicationMonth(application, month-1), 1));
			}

			if(month-2>0){
				results.add(new Tuple2<ApplicationMonth,Integer>(new ApplicationMonth(application, month-2), 1));
			}

			return results.iterator();
		});

		JavaPairRDD<ApplicationMonth, Integer> windowElements_count = windowElements_ones.reduceByKey((num1,num2)->new Integer(num1+num2));

		JavaPairRDD<ApplicationMonth, Integer> windowElements_count_filtered = windowElements_count.filter(pair->pair._2()==3);

		windowElements_count_filtered.keys().saveAsTextFile(outputPath2);

		JavaRDD<String> selectedApplication = windowElements_count_filtered.map(pair->pair._1().application);

		System.out.println("Number of selected applications: "+selectedApplication.count());
		
		// Close the Spark context
		sc.close();
	}
}
