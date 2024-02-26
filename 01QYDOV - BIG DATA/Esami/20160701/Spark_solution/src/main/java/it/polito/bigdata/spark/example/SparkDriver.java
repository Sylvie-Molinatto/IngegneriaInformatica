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
		Double threshold;
		
		inputPath1=args[0];
		inputPath2=args[1];
		outputPath1=args[2];
		outputPath2=args[3];
		threshold=Double.parseDouble(args[4]);

	
		// Create a configuration object and set the name of the application
		// SparkConf conf=new SparkConf().setAppName("Spark Lab #5");
		
		// Use the following command to create the SparkConf object if you want to run
		// your application inside Eclipse.
		// Remember to remove .setMaster("local") before running your application on the cluster
		SparkConf conf=new SparkConf().setAppName("Spark Lab #5").setMaster("local");
		
		// Create a Spark Context object
		JavaSparkContext sc = new JavaSparkContext(conf);

		// print the application ID
		System.out.println("******************************");
		System.out.println("ApplicationId: "+JavaSparkContext.toSparkContext(sc).applicationId());
		System.out.println("******************************");

		
		// Task 1 - Select the list of expensive never sold books
		
		// 1. Read the content of Books.txt
		JavaRDD<String> books = sc.textFile(inputPath1); 

		// 2. Filter only the expensive books
		JavaRDD<String> expensive_books = books.filter(book -> {
			String[] fields = book.split(",");
			double price = Double.parseDouble(fields[3]);
			if(price>30){
				return true;
			}
			else{
				return false;
			}
		});

		// 3. Select just the ids of expensive books
		JavaRDD<String> expensive_books_ids = expensive_books.map(book -> {
			String[] fields = book.split(",");
			return fields[0];
		});

		// 4. Read the content of BoughtBooks.txt
		JavaRDD<String> boughtBooks = sc.textFile(inputPath2);

		// 5. Select just the ids of bought books
		JavaRDD<String> boughtBooks_ids = boughtBooks.map(book -> {
			String fields[] = book.split(",");
			return fields[1];
		});

		// 6. Compute the difference between the expensive books and the bought books
		JavaRDD<String> expensive_non_sold_books = expensive_books_ids.subtract(boughtBooks_ids);

		// 7. Store the result in a HDFS folder
		expensive_non_sold_books.saveAsTextFile(outputPath1);

		// 8. Print the count of expensive non sold books in the standard output
		System.out.println("Number of expensive never-sold books: "+expensive_non_sold_books.count());
		

		// Task 2 - Select the customers with a propensity for cheap purchases

		// 1. Emit a pair (customer_id, ComplexCounter)
		JavaPairRDD<String, ComplexCounter> customer_purchases = boughtBooks.mapToPair(book -> {
			String[] fields = book.split(",");
			ComplexCounter c = new ComplexCounter();
			c.numPurchases = 1;
			if(Double.parseDouble(fields[3])<10){
				c.numCheapPurchases=1;
			}
			else{
				c.numCheapPurchases=0;
			}
			return new Tuple2<String, ComplexCounter>(fields[0], c);

		});

		// 2. Reduce by key
		JavaPairRDD<String, ComplexCounter> customer_purchases_aggregated = customer_purchases.reduceByKey((c1,c2) -> {
			ComplexCounter cc = new ComplexCounter();
			cc.numPurchases = c1.numPurchases+c2.numPurchases;
			cc.numCheapPurchases = c1.numCheapPurchases+c2.numCheapPurchases;
			return cc;
		});

		// 3. Filter customers with propensity
		JavaPairRDD<String, ComplexCounter> customer_with_propensity = customer_purchases_aggregated.filter(c -> {
			if(((double)c._2().numCheapPurchases)>=((double)c._2().numPurchases)*threshold){
				return true;
			}
			else{
				return false;
			}
		});

		// 5. Store the customers in an HDFS folder
		customer_with_propensity.keys().saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
