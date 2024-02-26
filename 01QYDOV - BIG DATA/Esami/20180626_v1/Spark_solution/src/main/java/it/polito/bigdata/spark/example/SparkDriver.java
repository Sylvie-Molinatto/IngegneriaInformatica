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

		Double CPUthr;
		Double RAMthr;
		String inputPath;
		String outputPath1;
		String outputPath2;

		CPUthr = Double.parseDouble(args[0]);
		RAMthr = Double.parseDouble(args[1]);
		inputPath = args[2];
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
		JavaRDD<String> perfomanceLogs = sc.textFile(inputPath);

		JavaRDD<String> performanceLogFiltered = perfomanceLogs.filter(line->{
			String[] fields = line.split(",");
			String date = fields[0];
			if(date.startsWith("2018/05")){
				return true;
			}
			else{
				return false;
			}
		}).cache();

		JavaPairRDD<String,ServerDetails> serverHourDetailsUsage = performanceLogFiltered.mapToPair(line->{
			String[] fields = line.split(",");
			String hour = fields[1].split(":")[0];
			String VSID = fields[2];
			double CPUUsage = Double.parseDouble(fields[3]);
			double RAMUsage = Double.parseDouble(fields[4]);
			ServerDetails sd = new ServerDetails(CPUUsage, RAMUsage,1);
			return new Tuple2<String,ServerDetails>(VSID+"_"+hour, sd);
		});

		JavaPairRDD<String, ServerDetails> serverHourDetailsUsageAggregated = serverHourDetailsUsage.reduceByKey((sd1, sd2)->{
			ServerDetails sd = new ServerDetails(sd1.CPUUsage+sd2.CPUUsage, sd1.RAMUsage+sd2.RAMUsage, sd1.count+sd2.count);
			return sd;
		});

		JavaPairRDD<String, ServerDetails> criticalPairs = serverHourDetailsUsageAggregated.filter(pair->{
			double avgCPU = (double) pair._2().CPUUsage / (double) pair._2().count;
			double avgRAM = (double) pair._2().RAMUsage / (double) pair._2().count;
			if(avgCPU>CPUthr && avgRAM>RAMthr){
				return true;
			}
			else{
				return false;
			}
		});

		criticalPairs.keys().saveAsTextFile(outputPath1);

		// Task 2
		JavaPairRDD<String, Double> serverDateHourCpuRamDetails = performanceLogFiltered.mapToPair(line -> {
			String[] fields = line.split(",");
			String date = fields[0];
			String hour = fields[1].split(":")[0];
			String VSID = fields[2];
			double CPUUsage = Double.parseDouble(fields[3]);
			return new Tuple2<String, Double>(VSID+"-"+date+"-"+hour, CPUUsage);
		});

		JavaPairRDD<String, Double> serverDateHourMaxCPU = serverDateHourCpuRamDetails.reduceByKey((sd1, sd2) -> {
			double cpuUsage;
			
			if(sd1.doubleValue()>=sd2.doubleValue()){
				cpuUsage = sd1.doubleValue();
			}
			else{
				cpuUsage = sd2.doubleValue();
			}
			return cpuUsage;
		});

		JavaPairRDD<String, Double> serverDateHourUnbalancedCPU = serverDateHourMaxCPU.filter(pair -> {
			if(pair._2().doubleValue()>90 || pair._2()<10){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, Counter> serverDateHourCounter = serverDateHourUnbalancedCPU.mapToPair(pair -> {
			String vsid_date_hour = pair._1();
			String vsid = vsid_date_hour.split("-")[0];
			String date = vsid_date_hour.split("-")[1];
			Double maxCpuUsage = pair._2();
			if(maxCpuUsage>90){
				Counter c = new Counter(1, 0);
				return new Tuple2<String,Counter>(vsid+"-"+date, c);
			}
			else{
				Counter c = new Counter(0, 1);
				return new Tuple2<String, Counter>(vsid+"-"+date, c);
			}
		});

		JavaPairRDD<String, Counter> serverDateCounterAggregated = serverDateHourCounter.reduceByKey( (c1, c2) -> {
			Counter c = new Counter(c1.cpuUsageGreater+c2.cpuUsageGreater, c1.cpuUsageLess+c2.cpuUsageLess);
			return c;
		});

		JavaPairRDD<String, Counter> serverDateUnbalancedDailyUsage = serverDateCounterAggregated.filter(pair -> {
			if(pair._2().cpuUsageGreater>=8 && pair._2().cpuUsageLess>=8){
				return true;
			}
			else{
				return false;
			}
		});

		serverDateUnbalancedDailyUsage.keys().saveAsTextFile(outputPath2);


		// Close the Spark context
		sc.close();
	}
}
