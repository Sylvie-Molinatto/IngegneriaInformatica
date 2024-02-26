package it.polito.bigdata.spark.example;

import org.apache.spark.api.java.*;
import org.apache.spark.SparkConf;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;

import scala.Tuple2;
import java.util.ArrayList;
import java.util.List;

public class SparkDriver {

	public static void main(String[] args) {

		// The following two lines are used to switch off some verbose log messages
		Logger.getLogger("org").setLevel(Level.OFF);
		Logger.getLogger("akka").setLevel(Level.OFF);

		String inputPath;
		String outputPath;

		inputPath = args[0];
		outputPath = args[1];

		// Create a configuration object and set the name of the application
		SparkConf conf = new SparkConf().setAppName("Spark Lab #6").setMaster("local");

		// Use the following command to create the SparkConf object if you want to run
		// your application inside Eclipse.
		// Remember to remove .setMaster("local") before running your application on the
		// cluster
		// SparkConf conf=new SparkConf().setAppName("Spark Lab #6").setMaster("local");

		// Create a Spark Context object
		JavaSparkContext sc = new JavaSparkContext(conf);

		// Read the content of the input file
		JavaRDD<String> reviewsRDD = sc.textFile(inputPath);

		JavaRDD<String> reviewsRDDnoHeader = reviewsRDD.filter(line -> !line.startsWith("Id,"));

		// Generate one pair UserId, ProductId for each input line
		// If a user reviews the same product multiple times duplicates must be removed.
		JavaPairRDD<String, String> pairUserProduct = reviewsRDDnoHeader.mapToPair(s -> {
			String[] features = s.split(",");

			return new Tuple2<String, String>(features[2], features[1]);
		}).distinct();

		// Generate one "transaction" for each user
		// <user_id> → < list of the product_ids reviewed>
		JavaPairRDD<String, Iterable<String>> UserIDListOfReviewedProducts = pairUserProduct.groupByKey();

		// We are interested only in the value part (the lists of products that have
		// been reviewed together)

		JavaRDD<Iterable<String>> transactions = UserIDListOfReviewedProducts.values();

		// Generate a PairRDD of (key,value) pairs. One pair for each combination of
		// products
		// appearing in the same transaction
		// - key = pair of products reviewed together
		// - value = 1
		JavaPairRDD<String, Integer> pairsOfProductsOne = transactions.flatMapToPair(products -> {
			List<Tuple2<String, Integer>> results = new ArrayList<>();

			for (String p1 : products) {
				for (String p2 : products) {
					if (p1.compareTo(p2) > 0)
						results.add(new Tuple2<String, Integer>(p1 + " " + p2, 1));
				}
			}

			return results.iterator();
		});

		// Count the frequency (i.e., number of occurrences) of each key (= pair of
		// products)
		JavaPairRDD<String, Integer> pairsFrequencies = pairsOfProductsOne
				.reduceByKey((count1, count2) -> count1 + count2);

		// Select only the pairs that appear more than once and their frequencies.
		JavaPairRDD<String, Integer> atLeast2PairsFrequencies = pairsFrequencies.filter(t -> t._2() > 1);

		// Swap the role of key and value
		JavaPairRDD<Integer, String> frequencyProducts = atLeast2PairsFrequencies.mapToPair(
				productsFrequency -> new Tuple2<Integer, String>(productsFrequency._2(), productsFrequency._1()));

		// Sort data by key
		JavaPairRDD<Integer, String> resultRDD = frequencyProducts.sortByKey(false);

		// Store the result
		resultRDD.saveAsTextFile(outputPath);

		// ***********************************
		// Task 2
		// ***********************************

		System.out.println("Version based on top");

		// Take the first 10 elements of pairsFrequencies
		// based on top + a personalized comparator
		List<Tuple2<String, Integer>> topList = atLeast2PairsFrequencies.top(10, new FreqComparatorTop());

		// Print the result on the standard output of the driver
		for (Tuple2<String, Integer> productFrequency : topList) {
			System.out.println(productFrequency);
		}

		// Or

		System.out.println("Version based on takeOrdered");

		List<Tuple2<String, Integer>> topListTakeOrdered = atLeast2PairsFrequencies.takeOrdered(10,
				new FreqComparatorTakeOrdered());

		for (Tuple2<String, Integer> productFrequency : topListTakeOrdered) {
			System.out.println(productFrequency);
		}

		// Or
		// There is already an RDD with the pairs sorted by frequency (the output of
		// Task 1)
		// We can use take to select the first 10 pairs of resultRDD

		System.out.println("Version based on take");

		List<Tuple2<Integer, String>> topListTake = resultRDD.take(10);

		for (Tuple2<Integer, String> productFrequency : topListTake) {
			System.out.println(productFrequency);
		}

		// Close the Spark context
		sc.close();
	}
}
