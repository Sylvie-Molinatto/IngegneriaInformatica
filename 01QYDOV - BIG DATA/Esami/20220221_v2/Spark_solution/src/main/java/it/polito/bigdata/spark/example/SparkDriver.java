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

		String inputPathItemsCatalogue;
		String inputPathPurchases;
		String outputPath1;
		String outputPath2;

		inputPathItemsCatalogue = args[0];
		inputPathPurchases = args[1];
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
		JavaRDD<String> purchases = sc.textFile(inputPathPurchases);

		JavaRDD<String> purchases_2020_2021 = purchases.filter(line->{
			String fields[] = line.split(",");
			String date = fields[0];
			if(date.startsWith("2020") || date.startsWith("2021")){
				return true;
			}
			else{
				return false;
			}
		}).cache();

		JavaPairRDD<String, NumPurchasesYear> itemId_ones = purchases_2020_2021.mapToPair(line->{
			String[] fields = line.split(",");
			String date = fields[0];
			String year = date.substring(0,4);
			String itemId = fields[2];
			NumPurchasesYear npy;
			if(year.equals("2020")){
				npy = new NumPurchasesYear(1,0);
			}
			else{
				npy = new NumPurchasesYear(0, 1);
			}
			return new Tuple2<String, NumPurchasesYear>(itemId, npy);
		});

		JavaPairRDD<String, NumPurchasesYear> itemId_numPurchasesYear = itemId_ones.reduceByKey((npy1, npy2) -> new NumPurchasesYear(npy1.numPurchases2020+npy2.numPurchases2020, npy1.numPurchases2021+npy2.numPurchases2021));

		JavaPairRDD<String, NumPurchasesYear> itemId_numPurchasesYearGreatherThan1000 = itemId_numPurchasesYear.filter(pair->{
			if(pair._2().numPurchases2020>=4 && pair._2().numPurchases2021>=4){ //10000, 4 is used for testing purposes
				return true;
			}
			else{
				return false;
			}
		});

		itemId_numPurchasesYearGreatherThan1000.keys().saveAsTextFile(outputPath1);

		// Task 2
		JavaRDD<String> itemsIntroducedBefore2020 = sc.textFile(inputPathItemsCatalogue).filter(line->{
			String[] fields = line.split(",");
			String date = fields[3].substring(0,10);
			if(date.compareTo("2020/01/01")<0){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, String> itemId_category_introducedBefore2020 = itemsIntroducedBefore2020.mapToPair(line->{
			String[] fields = line.split(",");
			String itemId = fields[0];
			String category = fields[2];
			return new Tuple2<String, String>(itemId, category);
		});

		JavaRDD<String> purchases2020 = purchases_2020_2021.filter(line->{
			String[] fields = line.split(",");
			String date = fields[0];
			if(date.startsWith("2020")){
				return true;
			}
			else{
				return false;
			}
		});
		
		JavaPairRDD<String, Integer> itemId_month_username_ones = purchases2020.mapToPair(line->{
			String[] fields = line.split(",");
			String date = fields[0];
			String month = date.split("/")[1];
			String userId = fields[1];
			String itemId = fields[2];
			return new Tuple2<String, Integer>(itemId+"-"+month+"-"+userId, 1);
		}).distinct();

		JavaPairRDD<String, Integer> itemId_month_ones = itemId_month_username_ones.mapToPair(pair->{
			String itemId_month_userId = pair._1();
			String itemId = itemId_month_userId.split("-")[0];
			String month = itemId_month_userId.split("-")[1];
			return new Tuple2<String, Integer>(itemId+"-"+month, pair._2());
		});

		JavaPairRDD<String, Integer> itemId_month_numDistinctUsers = itemId_month_ones.reduceByKey((num1,num2)->num1+num2);

		JavaPairRDD<String, Integer> itemId_month_numDistinctUsersLessThan10 = itemId_month_numDistinctUsers.filter(pair->pair._2()<10);

		JavaPairRDD<String, Integer> itemId_numMonthWithDistinctUsersLessThan10 = itemId_month_numDistinctUsersLessThan10.mapToPair(pair->{
			String itemId_month = pair._1();
			String itemId = itemId_month.split("-")[0];
			return new Tuple2<String, Integer>(itemId,1);
		}).reduceByKey((num1, num2)->num1+num2);
		
		JavaPairRDD<String, Integer> itemId_numMonthGreatherThan2 = itemId_numMonthWithDistinctUsersLessThan10.filter(pair->pair._2()>=2);

		JavaPairRDD<String, String> result = itemId_numMonthGreatherThan2.join(itemId_category_introducedBefore2020).mapToPair(pair->{
			String itemId = pair._1();
			String category = pair._2()._2();
			return new Tuple2<String, String>(itemId, category);
		});

		result.saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
