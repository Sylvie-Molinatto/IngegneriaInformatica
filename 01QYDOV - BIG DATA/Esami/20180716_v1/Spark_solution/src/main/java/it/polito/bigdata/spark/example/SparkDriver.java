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

		String inputPathFailures;
		String inputPathServers;
		String outputPath1;
		String outputPath2;

		inputPathFailures = args[0];
		inputPathServers = args[1];
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
		JavaRDD<String> failures = sc.textFile(inputPathFailures);

		JavaRDD<String> failuresFiltered = failures.filter(line -> {
			String[] fields = line.split(",");
			String date = fields[0];
			if(date.startsWith("2017")){
				return true;
			}
			else{
				return false;
			}
		}).cache();

		JavaPairRDD<String, Integer> serverIdFailuresOnes = failuresFiltered.mapToPair(line -> {
			String[] fields = line.split(",");
			String server_id = fields[2];
			return new Tuple2<String, Integer>(server_id, 1);
		});

		JavaPairRDD<String, Integer> serverIdFailuresAggregated = serverIdFailuresOnes.reduceByKey((numFailures1, numFailures2) -> {
			return numFailures1+numFailures2;
		});

		JavaPairRDD<String, Integer> serverIdFailures365 = serverIdFailuresAggregated.filter(pair -> {
			if(pair._2().intValue()>=365){
				return true;
			}
			else{
				return false;
			}
		});

		serverIdFailures365.saveAsTextFile(outputPath1);


		// Task 2
		JavaPairRDD<String, Counter> serverMonthlyFailuresOnes = failuresFiltered.mapToPair(line->{
			String[] fields = line.split(",");
			String date = fields[0];
			String month = date.split("/")[1];
			String server_id = fields[2];
            int downtime = Integer.parseInt(fields[4]);
			Counter c = new Counter(1, downtime,0);
			return new Tuple2<String, Counter>(server_id+"-"+month, c);
		});

		JavaPairRDD<String,Counter> serverMonthlyFailuresAggregated = serverMonthlyFailuresOnes.reduceByKey((failure1, failure2)->{
			Counter c = new Counter(failure1.numFailures+failure2.numFailures, failure1.downTime+failure2.downTime,0);
			return c;
		});

		JavaPairRDD<String,Counter> serverAnnualFailures = serverMonthlyFailuresAggregated.mapToPair(pair -> {
			String server_month = pair._1();
			String server = server_month.split("-")[0];
			int numMonth;
			if(pair._2().numFailures>=2){
				numMonth=1;
			}
			else{
				numMonth=0;
			}
			Counter c = new Counter(pair._2().numFailures, pair._2().downTime, numMonth);
			return new Tuple2<String, Counter>(server, c);
		});

		JavaPairRDD<String,Counter> serverAnnualFailuresAggregated = serverAnnualFailures.reduceByKey((c1, c2) -> {
			Counter c = new Counter(c1.numFailures+c2.numFailures, c1.downTime+c2.downTime, c1.numMonth+c2.numMonth);
			return c;
		});

		JavaPairRDD<String,Counter> serverAnnualFailuresAggregatedFiltered = serverAnnualFailuresAggregated.filter(pair -> {
			if(pair._2().numMonth==12 && pair._2().downTime>=1440){
				return true;
			}
			else{
				return false;
			}
		});

		serverAnnualFailuresAggregatedFiltered.keys().saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
