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

		String inputPath1;
		String inputPath2;
		String outputPath1;
		String outputPath2;

		inputPath1 = args[0];
		inputPath2 = args[1];
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
		JavaRDD<String> anomalies = sc.textFile(inputPath2);

		JavaRDD<String> anomalies2010_2018 = anomalies.filter(line -> {
			String fields[] = line.split(",");
			String date = fields[1].substring(0,10);
			if(date.compareTo("2010/01/01")>=0 && date.compareTo("2018/12/31")<=0){
				return true;
			}
			else{
				return false;
			}
		}).cache();

		JavaRDD<String> anomaliesFiltered = anomalies2010_2018.filter(line -> {
			String fields[] = line.split(",");
			Integer anomalousTemperature = Integer.parseInt(fields[2]);
			if(anomalousTemperature>100){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, Integer> sid_year_ones = anomaliesFiltered.mapToPair(line->{
			String fields[] = line.split(",");
			String serverId = fields[0];
			String date = fields[1];
			String year = date.substring(0,4);
			return new Tuple2<String, Integer>(serverId+"-"+year, 1);
		});

		JavaPairRDD<String, Integer> sid_year_numAnomalies = sid_year_ones.reduceByKey((num1,num2)->num1+num2);

		JavaPairRDD<String, Integer> sid_ones = sid_year_numAnomalies.mapToPair(pair->{
			String sid_year = pair._1();
			String sid = sid_year.split("-")[0];
			if(pair._2().intValue()>=50){
				return new Tuple2<String, Integer>(sid,1);
			}
			else{
				return new Tuple2<String,Integer>(sid,0);
			}
		});

		JavaPairRDD<String,Integer> sid_numAnomalies = sid_ones.reduceByKey((num1,num2)->num1+num2);

		JavaPairRDD<String,Integer> sid_numAnomalies_filtered = sid_numAnomalies.filter(pair->pair._2()>0);

		sid_numAnomalies_filtered.keys().saveAsTextFile(outputPath1);

		// Task 2

		// Compute the number of anomalies of each server
		JavaPairRDD<String, Integer> serversIds_ones = anomalies2010_2018.mapToPair(line->{
			String fields[] = line.split(",");
			String serverId = fields[0];
			return new Tuple2<String, Integer>(serverId, 1);
		});

		JavaPairRDD<String, Integer> serverIds_numAnomalies = serversIds_ones.reduceByKey((num1,num2)->num1+num2);

		JavaPairRDD<String,Integer> serverIds_numAnomaliesGreaterThan10 = serverIds_numAnomalies.filter(pair->pair._2()>10);

		JavaRDD<String> allServers = sc.textFile(inputPath1).cache();

		JavaRDD<String> alldc = allServers.map(line->{
			String fields[] = line.split(",");
			String dcid = fields[2];
			return dcid;
		}).distinct();

		JavaPairRDD<String, String> allServersIdsNames = allServers.mapToPair(line -> {
			String fields[] = line.split(",");
			String sid = fields[0];
			String dcid = fields[2];
			return new Tuple2<String,String>(sid, dcid);
		});

		// (sid,(dcid, numAnomalies))
		JavaPairRDD<String, Tuple2<String, Integer>> dataCentersNonAnomalous = allServersIdsNames.join(serverIds_numAnomaliesGreaterThan10);

		JavaRDD<String> dc_ids_non_anomalous = dataCentersNonAnomalous.map(pair->pair._2()._1());

		JavaRDD<String> result = alldc.subtract(dc_ids_non_anomalous).cache();

		result.saveAsTextFile(outputPath2);

		System.out.println("Data server found: "+result.count());

		// Close the Spark context
		sc.close();
	}
}
