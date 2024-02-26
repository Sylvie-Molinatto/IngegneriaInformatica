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

		String inputPathServers;
		String inputPathPatchedServers;
		String outputPath1;
		String outputPath2;

		inputPathServers = args[0];
		inputPathPatchedServers = args[1];
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
		JavaRDD<String> patchedServers = sc.textFile(inputPathPatchedServers).cache();

		JavaRDD<String> patchedServersFiltered = patchedServers.filter(line->{
			String[] fields = line.split(",");
			String date = fields[2];
			if(date.startsWith("2018") || date.startsWith("2019")){
				return true;
			}
			else{
				return false;
			}
		});

		//Count the number of patches for server for year
		JavaPairRDD<String, Integer> serverId_year_ones = patchedServersFiltered.mapToPair(line->{
			String[] fields = line.split(",");
			String sid = fields[0];
			String date = fields[2];
			String year = date.split("/")[0];
			return new Tuple2<String,Integer>(sid+"-"+year,1);
		});

		JavaPairRDD<String, Integer> serverId_year_numPatches = serverId_year_ones.reduceByKey((num1,num2) -> new Integer(num1+num2));

		JavaPairRDD<String, CountYear> server_numPatches = serverId_year_numPatches.mapToPair(pair->{
			String sid = pair._1().split("-")[0];
			int year = Integer.parseInt(pair._1().split("-")[1]);
			CountYear cy = new CountYear(pair._2(), year);
			return new Tuple2<String, CountYear>(sid, cy);
		});

		JavaPairRDD<String, CountYear> serverHighDecreaseNumPatches = server_numPatches.reduceByKey((cy1, cy2) -> {
			if(cy1.year<cy2.year){
				if(cy2.count<0.5*cy2.count){
					return new CountYear(cy2.count, cy2.year);
				}
				else{
					return null;
				}
			}
			else{
				if(cy1.count<0.5*cy2.count){
					return new CountYear(cy1.count, cy1.year);
				}
				else{
					return null;
				}
			}
		});

		JavaPairRDD<String, CountYear> serverHighDecreaseNumPatchesFiltered = serverHighDecreaseNumPatches.filter(pair -> pair._2()!=null);

		JavaRDD<String> servers = sc.textFile(inputPathServers);

		JavaPairRDD<String, String> serverId_name = servers.mapToPair(line->{
			String fields[] = line.split(",");
			String sid = fields[0];
			String name = fields[1];
			return new Tuple2<String,String>(sid,name);
		});

		// (sid, (name, (count, year)))
		JavaPairRDD<String, Tuple2<String, CountYear>> serverIds_name_countYear = serverId_name.join(serverHighDecreaseNumPatchesFiltered);

		JavaPairRDD<String, String> serverIds_name = serverIds_name_countYear.mapToPair(pair->{
			String sid = pair._1();
			String name = pair._2()._1();
			return new Tuple2<String, String>(sid, name);
		});

		serverIds_name.saveAsTextFile(outputPath1);

		// Task 2

		JavaPairRDD<String, Integer> serverIds_date_ones = patchedServers.mapToPair(line->{
			String[] fields = line.split(",");
			String sid = fields[0];
			String date = fields[2];
			return new Tuple2<String, Integer>(sid+"-"+date,1);
		});

		JavaPairRDD<String, Integer> serverIds_date_numPatches = serverIds_date_ones.reduceByKey((num1,num2) -> new Integer(num1+num2));

		JavaPairRDD<String, Integer> serverIds_date_numPatchesPerDayGreatherThan1 = serverIds_date_numPatches.filter(pair->{
			if(pair._2()>1){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, String> serverIds_numPatchesPerDayGreatherThan1 = serverIds_date_numPatchesPerDayGreatherThan1.mapToPair(pair->{
			String sid = pair._1().split("-")[0];
			return new Tuple2<String, String>(sid, "");
		});

		JavaPairRDD<String, Tuple2<String, String>> serverIds_names_toBeExcluded = serverId_name.join(serverIds_numPatchesPerDayGreatherThan1);

		JavaPairRDD<String, String> serverIdsNamesToBeExcluded = serverIds_names_toBeExcluded.mapToPair(pair->{
			String sid = pair._1();
			String name = pair._2()._1();
			return new Tuple2<String,String>(sid,name);
		});

		JavaPairRDD<String, String> result = serverId_name.subtract(serverIdsNamesToBeExcluded);

		result.saveAsTextFile(outputPath2);

		JavaRDD<String> distinctModels = result.map(pair->{
			String model = pair._2();
			return model;
		}).distinct();

		System.out.println("Number of distinct models: "+distinctModels.count());

		// Close the Spark context
		sc.close();
	}
}
