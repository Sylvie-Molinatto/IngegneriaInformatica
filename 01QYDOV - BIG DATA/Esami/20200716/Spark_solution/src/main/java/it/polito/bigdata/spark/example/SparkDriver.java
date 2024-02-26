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
		JavaRDD<String> purchases = sc.textFile(inputPath);

		JavaRDD<String> purchases2018 = purchases.filter(line->{
			String fields[] = line.split(",");
			String date = fields[2];
			if(date.startsWith("2018")){
				return true;
			}
			else{
				return false;
			}
		}).cache();

		JavaPairRDD<String, Integer> bid_date_ones = purchases2018.mapToPair(line->{
			String[] fields = line.split(",");
			String bid = fields[1];
			String date = fields[2];
			return new Tuple2<String, Integer>(bid+"-"+date, 1);
		});

		JavaPairRDD<String, Integer> bid_date_numPurchases = bid_date_ones.reduceByKey((num1,num2)->new Integer(num1+num2));

		JavaPairRDD<String, Integer> bid_numPurchases = bid_date_numPurchases.mapToPair(pair->{
			String bid_date = pair._1();
			String bid = bid_date.split("-")[0];
			return new Tuple2<String, Integer>(bid, pair._2());
		});

		JavaPairRDD<String, Integer> bid_maxDailyNumPurchases = bid_numPurchases.reduceByKey((num1, num2)->{
			if(num1>=num2){
				return new Integer(num1);
			}
			else{
				return new Integer(num2);
			}
		});

		bid_maxDailyNumPurchases.saveAsTextFile(outputPath1);

		// Task 2
		// compute total num of book purchased for each bood in 2018
		JavaPairRDD<String, Integer> bidTotalCountPurchase = bid_numPurchases.reduceByKey((num1, num2)->new Integer(num1+num2));

		// Select for each book the dates with more that 0.1*total num. purchases book 2018 
		JavaPairRDD<String, DateNumPurchases> bid_DateNumPurchases = bid_date_numPurchases.mapToPair(pair->{
			String bid_date = pair._1();
			String bid = bid_date.split("-")[0];
			String date = bid_date.split("-")[1];
			DateNumPurchases dnp = new DateNumPurchases(date, pair._2());
			return new Tuple2<String, DateNumPurchases>(bid, dnp);
		});

		JavaPairRDD<String, Tuple2<DateNumPurchases, Integer>> bid_DateNumPurchase_totalPurchases = bid_DateNumPurchases.join(bidTotalCountPurchase);

		JavaPairRDD<String, Tuple2<DateNumPurchases, Integer>> bid_DateNumPurchases_manypurchases = bid_DateNumPurchase_totalPurchases.filter(pair->{
			int numPurchases = pair._2()._1().numPurchases;
			int totalPurchases = pair._2()._2();

			if(numPurchases>0.1*totalPurchases){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, Integer>  bidDateElementRDD = bid_DateNumPurchases_manypurchases.flatMapToPair(pair->{
			
			String bid = pair._1();
			String date = pair._2()._1().date;
			List<Tuple2<String, Integer>> results = new ArrayList<Tuple2<String, Integer>>();
			results.add(new Tuple2<String,Integer>(bid+","+date, 1));

			String previousDate = DateTool.previousDeltaDate(date, 1);
			if(previousDate.compareTo("20180101")>=0){
				results.add(new Tuple2<String,Integer>(bid+","+previousDate, 1));
				String prevPreviousDate = DateTool.previousDeltaDate(previousDate, 1);
				if(prevPreviousDate.compareTo("20180101")>=0){
					results.add(new Tuple2<String, Integer>(bid+","+prevPreviousDate, 1));
				}
			}

			return results.iterator();
		});

		JavaPairRDD<String, Integer> bidDateNumElementsRDD = bidDateElementRDD.reduceByKey((num1,num2)->new Integer(num1+num2));

		JavaPairRDD<String, Integer> bidDateThreeElementsRDD = bidDateNumElementsRDD.filter(pair->pair._2()>=3);

		bidDateThreeElementsRDD.keys().saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
