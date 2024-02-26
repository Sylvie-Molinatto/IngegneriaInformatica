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
		JavaRDD<String> prices = sc.textFile(inputPath);

		JavaRDD<String> pricesFiltered = prices.filter(line->{
			String[] fields = line.split(",");
			String date = fields[0];
			if(date.startsWith("2014")){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String,MinMaxPrice> stockId_date_MinMaxPrice = pricesFiltered.mapToPair(line->{
			String[] fields = line.split(",");
			String date = fields[0];
			String stockId = fields[2];
			Double price = Double.parseDouble(fields[3]);
			MinMaxPrice mmp = new MinMaxPrice(price, price);
			return new Tuple2<String, MinMaxPrice>(stockId+"-"+date, mmp);
		});

		JavaPairRDD<String, MinMaxPrice> stockId_date_MinMaxPrice_aggregated = stockId_date_MinMaxPrice.reduceByKey((mmp1, mmp2)->{
			double minPrice;
			double maxPrice;
			if(mmp1.minPrice<=mmp2.minPrice){
				minPrice = mmp1.minPrice;
			}
			else{
				minPrice = mmp2.minPrice;
			}

			if(mmp1.maxPrice>mmp2.maxPrice){
				maxPrice = mmp1.maxPrice;
			}
			else{
				maxPrice = mmp2.maxPrice;
			}
			return new MinMaxPrice(minPrice, maxPrice);
		});

		JavaPairRDD<String, Double> stockId_date_dailyVariation = stockId_date_MinMaxPrice_aggregated.mapToPair(pair->{
			String stockId_date = pair._1();
			double dailyVariation = pair._2().maxPrice-pair._2().minPrice;
			
			return new Tuple2<String, Double>(stockId_date, dailyVariation);
		}).cache();

		JavaPairRDD<String, Double> stockId_dailyVariation_filtered = stockId_date_dailyVariation.filter(pair-> pair._2().doubleValue()<5);

		JavaPairRDD<String,Integer> stockId_numDays_ones = stockId_dailyVariation_filtered.mapToPair(pair-> new Tuple2<String,Integer>(pair._1().split("-")[0], 1));
		
		JavaPairRDD<String,Integer> stockId_numDays = stockId_numDays_ones.reduceByKey((num1,num2)->num1+num2);

		JavaPairRDD<String,Integer> stockId_numDays_filtered = stockId_numDays.filter(pair -> pair._2()>0);

		stockId_numDays_filtered.saveAsTextFile(outputPath1);

		// Task 2
		JavaPairRDD<String, Double> stockIdSequenceFirstDate_DailyVariations = stockId_date_dailyVariation.flatMapToPair(pair->{
			String stockId_date = pair._1();
			String stockId = stockId_date.split("-")[0];
			String date = stockId_date.split("-")[1];
			String previousDate = DateTool.previousDate(date);
			Double dailyVariation = pair._2();
			List<Tuple2<String, Double>> returnedPairs = new ArrayList<Tuple2<String, Double>>();
			returnedPairs.add(new Tuple2<String,Double>(stockId_date, dailyVariation));
			returnedPairs.add(new Tuple2<String,Double>(stockId+"-"+previousDate, dailyVariation));
			return returnedPairs.iterator();
		});

		JavaPairRDD<String, Iterable<Double>> stockIdSequence_dailyVariations = stockIdSequenceFirstDate_DailyVariations.groupByKey();

		JavaPairRDD<String, Iterable<Double>> stockIDUnstableTrends = stockIdSequence_dailyVariations.filter(pair -> {

			Double dailyVariation1 = null;
			Double dailyVariation2 = null;

			for(Double d: pair._2()){
				if(dailyVariation1==null){
					dailyVariation1=d;
				}
				else{
					dailyVariation2=d;
				}
			}

			if(dailyVariation2!=null && Math.abs(dailyVariation2-dailyVariation1)>1){
				return true;
			}
			else{
				return false;
			}
		});

		stockIDUnstableTrends.keys().saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
