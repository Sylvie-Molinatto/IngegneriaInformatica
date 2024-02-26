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

		String inputPath;
		Integer NW;
		String outputPath1;
		String outputPath2;

		inputPath = args[0];
		NW = Integer.parseInt(args[1]);
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
		

		// Task 1 - Lowest stock price per pair (stock, date)
		JavaRDD<String> prices = sc.textFile(inputPath).filter(data -> {
			String fields[] = data.split(",");
			if(fields[1].startsWith("2016")){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String,Double> stockDatePricePairs = prices.mapToPair(data -> {
			String[] fields = data.split(",");
			String stockId = fields[0];
			String date = fields[1];
			Double price = Double.parseDouble(fields[3]);
			return new Tuple2<String, Double>(stockId+"_"+date, price);
		}).cache();

		JavaPairRDD<String,Double> stockDatePricePairsReduced = stockDatePricePairs.reduceByKey((d1, d2) -> {
			if(d1.doubleValue()<=d2.doubleValue()){
				return d1;
			}
			else{
				return d2;
			}
		});

		stockDatePricePairsReduced.sortByKey().saveAsTextFile(outputPath1);


		// Task 2 - Select stocks that are frequently associated by a 'positive weekly trend'
		
		JavaPairRDD<String, Double> stockDateHighestPricePairs = stockDatePricePairs.reduceByKey((p1,p2) -> {
			if(p1.doubleValue()>p2.doubleValue()){
				return new Double(p1);
			}
			else{
				return new Double(p2);
			}
		});

		JavaPairRDD<String, FirstDatePriceLastDatePrice> stockId_week_date_price = stockDateHighestPricePairs.mapToPair(data -> {
			String stockId_Date = data._1();
			String fields[] = stockId_Date.split("_");
			String stockId = fields[0];
			String date = fields[1];
			Integer week = DateTool.weekNumber(date);
			Double price = data._2();
			FirstDatePriceLastDatePrice fdpldp = new FirstDatePriceLastDatePrice(date, price, date, price);

			return new Tuple2<String, FirstDatePriceLastDatePrice>(stockId+"_"+week, fdpldp);
		});

		JavaPairRDD<String, FirstDatePriceLastDatePrice> stockId_week_date_price_reduced = stockId_week_date_price.reduceByKey((d1,d2) -> {
			String firstdate;
			Double firstprice;
			String lastdate;
			Double lastprice;
			
			if(d1.firstDate.compareTo(d2.firstDate)<0){
				firstdate = d1.firstDate;
 				firstprice = d1.firstPrice;
			}
			else{
				firstdate = d2.firstDate;
				firstprice = d2.firstPrice;
			}

			if(d1.lastDate.compareTo(d2.lastDate)>0){
				lastdate = d1.lastDate;
				lastprice = d1.lastPrice;
			}
			else{
				lastdate = d2.lastDate;
				lastprice = d2.lastPrice;
			}

			return new FirstDatePriceLastDatePrice(firstdate, firstprice, lastdate, lastprice);
		});

		JavaPairRDD<String, FirstDatePriceLastDatePrice>  stockId_WeekNumber_PositiveWeeks = stockId_week_date_price_reduced.filter( value -> {
			if(value._2().lastPrice.doubleValue()>value._2().firstPrice.doubleValue()){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, Integer> stockId_One = stockId_WeekNumber_PositiveWeeks.mapToPair(data -> {
			String stockId_week = data._1();
			String stockId = stockId_week.split("_")[0];
			return new Tuple2<String, Integer>(stockId,1);
		});

		JavaPairRDD<String,Integer> stockId_count = stockId_One.reduceByKey((i1,i2)->
			i1+i2
		);

		JavaPairRDD<String, Integer> stockId_count_positiveWeeks = stockId_count.filter((value) ->{
			if(value._2().intValue()>=NW){
				return true;
			}
			else{
				return false;
			}
		});

		stockId_count_positiveWeeks.keys().saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
