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

		String inputPathCompanies;
		String inputPathDailyPowerConsumption;
		String inputPathDataCenters;
		String outputPath1;
		String outputPath2;

		inputPathCompanies = args[0];
		inputPathDailyPowerConsumption = args[1];
		inputPathDataCenters = args[2];
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
		JavaRDD<String> dailyPowerConsumptions = sc.textFile(inputPathDailyPowerConsumption).cache();

		JavaPairRDD<String, Counter> date_counterOnes = dailyPowerConsumptions.mapToPair(line -> {
			String[] fields = line.split(",");
			String date = fields[1];
			int powerConsumption = Integer.parseInt(fields[2]);
			int requirementRespected = 0;
			if(powerConsumption>=1000){
				requirementRespected = 1;
			}
			int countDC = 1;
			Counter c = new Counter(requirementRespected, countDC);
			return new Tuple2<String, Counter>(date, c);
		});

		JavaPairRDD<String, Counter> date_counterAggregated = date_counterOnes.reduceByKey((c1,c2) -> {
			Counter c = new Counter(c1.requirementRespected+c2.requirementRespected, c1.countDC+c2.countDC);
			return c;
		});

		JavaRDD<String> result1 = date_counterAggregated.filter(pair->{
			int requirementRespected = pair._2().requirementRespected;
			int countDC = pair._2().countDC;
			if(requirementRespected>=0.9*countDC){
				return true;
			}
			else{
				return false;
			}
		}).keys();

		result1.saveAsTextFile(outputPath1);

		// Task 2

		JavaPairRDD<String, String> dcID_continent = sc.textFile(inputPathDataCenters).mapToPair(line -> {
			String[] fields = line.split(",");
			String dcID = fields[0];
			String continent = fields[4];
			return new Tuple2<String, String>(dcID, continent);
		});

		JavaRDD<String> dailyPowerConsumption2021 = dailyPowerConsumptions.filter(line -> {
			String[] fields = line.split(",");
			String date = fields[1];
			if(date.startsWith("2021")){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, Integer> dcID_dailyPowerConsumption = dailyPowerConsumption2021.mapToPair(line -> {
			String[] fields = line.split(",");
			String dcID = fields[0];
			int powerConsumption = Integer.parseInt(fields[2]);
			return new Tuple2<String, Integer>(dcID, powerConsumption);
		});

		// (dcId, (continent, dailyPowerConsumption)
		JavaPairRDD<String, Tuple2<String, Integer>> dcID_continent_dailyPowerConsumption = dcID_continent.join(dcID_dailyPowerConsumption);

		JavaPairRDD<String, PowerConsumptionCountDC> continent_PowerConsumptionCountDC_ones = dcID_continent_dailyPowerConsumption.mapToPair(pair -> {
			String continent = pair._2()._1();
			int powerConsumption = pair._2()._2();
			PowerConsumptionCountDC pccd = new PowerConsumptionCountDC(powerConsumption, 1);
			return new Tuple2<String, PowerConsumptionCountDC>(continent, pccd);
		});

		JavaPairRDD<String, PowerConsumptionCountDC> continent_PowerConsumptionCountDC = continent_PowerConsumptionCountDC_ones.reduceByKey((pccd1, pccd2) -> {
			PowerConsumptionCountDC pccd = new PowerConsumptionCountDC(pccd1.powerConsumption+pccd2.powerConsumption, pccd1.countDC+pccd2.countDC);
			pccd.avg = (double) pccd.powerConsumption / (double) pccd.countDC;
			return pccd;
		}).cache();

		PowerConsumptionCountDC maxCountAvg = continent_PowerConsumptionCountDC.values().reduce((pccd1, pccd2) -> {
			double maxAvg;
			int maxCount;
			if(pccd1.countDC>pccd2.countDC){
				maxCount = pccd1.countDC;
			}
			else{
				maxCount = pccd2.countDC;
			}

			if(pccd1.avg >pccd2.avg){
				maxAvg = pccd1.avg;
			}
			else{
				maxAvg = pccd2.avg;
			}
			PowerConsumptionCountDC result = new PowerConsumptionCountDC(0, maxCount);
			result.avg = maxAvg;
			return result;
		});


		JavaRDD<String> result = continent_PowerConsumptionCountDC.filter(pair -> {
			if(pair._2().countDC==maxCountAvg.countDC && pair._2().avg==maxCountAvg.avg){
				return true;
			}
			else{
				return false;
			}
		}).keys();
		
		result.saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
