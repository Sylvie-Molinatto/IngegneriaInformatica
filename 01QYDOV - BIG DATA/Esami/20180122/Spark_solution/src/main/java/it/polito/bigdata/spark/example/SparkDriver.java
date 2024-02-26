package it.polito.bigdata.spark.example;

import org.apache.spark.api.java.*;
import org.apache.spark.SparkConf;

import java.util.List;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import scala.Tuple2;
	
public class SparkDriver {
	
	public static void main(String[] args) {

		// The following two lines are used to switch off some verbose log messages
		Logger.getLogger("org").setLevel(Level.OFF);
		Logger.getLogger("akka").setLevel(Level.OFF);

		String inputPathBooks;
		String inputPathPurchases;
		String outputPath1;
		String outputPath2;

		inputPathBooks = args[0];
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
		

		// Task 1 - Books with anomalous price behavior in 2017.
		JavaRDD<String> purchases = sc.textFile(inputPathPurchases).filter(line -> {
			String[] fields = line.split(",");
			String date = fields[2];
			if(date.startsWith("2017")){
				return true;
			}
			else{
				return false;
			}
		}).cache();

		JavaPairRDD<String,BookDetails> bookMinMaxPricesPurchases = purchases.mapToPair(line -> {
			String[] fields = line.split(",");
			String bookId = fields[1];
			double price = Double.parseDouble(fields[3]);
			BookDetails bd = new BookDetails(price, price);
			return new Tuple2<String, BookDetails>(bookId, bd);
		});

		JavaPairRDD<String,BookDetails> bookMinMaxPrices = bookMinMaxPricesPurchases.reduceByKey((book1, book2)->{
			double maxPrice;
			double minPrice;
			if(book1.maxPrice>=book2.maxPrice){
				maxPrice = book1.maxPrice;
			}
			else{
				maxPrice = book2.maxPrice;
			}

			if(book1.minPrice<=book2.minPrice){
				minPrice = book1.minPrice;
			}
			else{
				minPrice = book2.minPrice;
			}
			BookDetails bd = new BookDetails(maxPrice, minPrice);
			return bd;
		});

		JavaPairRDD<String, BookDetails> anomalousPriceBooks = bookMinMaxPrices.filter(book -> {
			if(book._2().maxPrice-book._2().minPrice>=15){
				return true;
			}
			else{
				return false;
			}
		});

		anomalousPriceBooks.saveAsTextFile(outputPath1);


		// Task 2
		JavaRDD<String> books = sc.textFile(inputPathBooks);

		JavaRDD<String> booksIds = books.map(line->{
			String[] fields = line.split(",");
			String bookId = fields[0];
			return bookId;
		});

		JavaRDD<String> soldBooksIds = purchases.map(line -> {
			String[] fields = line.split(",");
			String bookId = fields[1];
			return bookId;
		});

		JavaRDD<String> neverSoldBooks = booksIds.subtract(soldBooksIds);

		List<String> neverPurchasedBooks = neverSoldBooks.collect();

		JavaPairRDD<String, GenreDetails> bookGenreSold = books.mapToPair(line -> {
			String[] fields = line.split(",");
			String bookId = fields[0];
			String genre = fields[2];
			int unsold;
			if(neverPurchasedBooks.contains(bookId)){
				unsold=1;
			}
			else{
				unsold=0;
			}
			GenreDetails gd = new GenreDetails(1, unsold);
			return new Tuple2<String, GenreDetails>(genre, gd);
		});

		JavaPairRDD<String, GenreDetails> bookGenrePercentage = bookGenreSold.reduceByKey((book1, book2) -> {
			GenreDetails gd = new GenreDetails(book1.totalBooks+book2.totalBooks, book1.unsoldBooks+book2.unsoldBooks);
			return gd;
		});

		bookGenrePercentage.saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
