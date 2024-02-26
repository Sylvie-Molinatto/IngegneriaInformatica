package it.polito.bigdata.spark.example;

import org.apache.spark.api.java.*;

import scala.Tuple2;

import org.apache.spark.SparkConf;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;
	
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
		JavaRDD<String> stocksPrices = sc.textFile(inputPath);

		JavaRDD<String> stockPricesFiltered = stocksPrices.filter(line-> {
			String[] fields = line.split(",");
			String date = fields[1];
			if(date.startsWith("2017")){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, PricesDetails> stockId_date_pricesDetails = stockPricesFiltered.mapToPair(line -> {
			String fields[] = line.split(",");
			String stockId = fields[0];
			String date = fields[1];
			double price = Double.parseDouble(fields[3]);
			PricesDetails pd = new PricesDetails(price, price);
			return new Tuple2<String, PricesDetails>(stockId+"-"+date, pd);
		});

		JavaPairRDD<String, PricesDetails> stockId_date_pricesDetails_aggregated = stockId_date_pricesDetails.reduceByKey((pd1,pd2) -> {
			double minPrice;
			double maxPrice;
			if(pd1.maxPrice>=pd2.maxPrice){
				maxPrice = pd1.maxPrice;
			}
			else{
				maxPrice = pd2.maxPrice;
			}

			if(pd1.minPrice<=pd2.minPrice){
				minPrice = pd1.minPrice;
			}
			else{
				minPrice = pd2.minPrice;
			}

			PricesDetails pd = new PricesDetails(minPrice, maxPrice);
			return pd;
		});

  		// Compute daily variation for each stockId+date
		JavaPairRDD<String, Double> stockDate_DailyVariation = stockId_date_pricesDetails_aggregated
				.mapValues(minmax -> new Double(minmax.maxPrice - minmax.minPrice)).cache();

		// Select only the element with a daily variation > 10
		JavaPairRDD<String, Double> stockDate_DailyVariationGreater10 = stockDate_DailyVariation
				.filter(pairVariation -> pairVariation._2() > 10);

		// Count the number of dates with daily variation > 10 for each stockId
		// Map each input element to a pair (stockId, +1)
		JavaPairRDD<String, Integer> stockIdOne = stockDate_DailyVariationGreater10
				.mapToPair(stockDateVariation -> new Tuple2<String, Integer>(stockDateVariation._1().split("-")[0],
						new Integer(1)));

		// ReduceByKey to count the number of dates for each stockId
		JavaPairRDD<String, Integer> stockIdNumDates = stockIdOne.reduceByKey((v1, v2) -> v1 + v2);

		stockIdNumDates.saveAsTextFile(outputPath1);

		// Task 2
		JavaPairRDD<String, Double> stockIdSequenceFirstDate_DailyVariations = stockDate_DailyVariation.flatMapToPair(pair-> {
			List<Tuple2<String, Double>> pairs = new ArrayList<Tuple2<String, Double>>();
			String stockId_date = pair._1();

			pairs.add(new Tuple2<String, Double>(stockId_date, pair._2()));

			String stockId = stockId_date.split("-")[0];
			String date = stockId_date.split("-")[1];
			String previousDate = DateTool.previousDate(date);
			String stockIdPreviousDate = stockId+"-"+previousDate;

			pairs.add(new Tuple2<String, Double>(stockIdPreviousDate, pair._2()));

			return pairs.iterator();
		});

		JavaPairRDD<String, Iterable<Double>> stockIdTwoConsecutiveDatesDailyVariations = stockIdSequenceFirstDate_DailyVariations.groupByKey();

		JavaPairRDD<String, Iterable<Double>> stockIDStableTrends = stockIdTwoConsecutiveDatesDailyVariations.filter(pair -> {

			Double dailyVariation1 = null;
			Double dailyVariation2 = null;

			for(Double d : pair._2()){
				if(dailyVariation1==null){
					dailyVariation1=new Double(d);
				}
				else{
					dailyVariation2=new Double(d);
				}
			}

			if(dailyVariation2!=null && Math.abs(dailyVariation1-dailyVariation2)>=0.1){
				return true;
			}
			else{
				return false;
			}
			
		});

		stockIDStableTrends.keys().saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
