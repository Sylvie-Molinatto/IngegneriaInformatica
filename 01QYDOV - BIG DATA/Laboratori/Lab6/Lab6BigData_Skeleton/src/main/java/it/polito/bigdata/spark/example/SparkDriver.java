package it.polito.bigdata.spark.example;

import org.apache.spark.api.java.*;
import org.apache.spark.api.java.function.Function2;

import scala.Tuple2;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.spark.SparkConf;
	
public class SparkDriver {
	
	public static void main(String[] args) {

		String inputPath;
		String outputPath;
		
		inputPath=args[0];
		outputPath=args[1];

	
		// Create a configuration object and set the name of the application
		SparkConf conf=new SparkConf().setAppName("Spark Lab #6");
		
		// Use the following command to create the SparkConf object if you want to run
		// your application inside Eclipse.
		// SparkConf conf=new SparkConf().setAppName("Spark Lab #6").setMaster("local");
		// Remember to remove .setMaster("local") before running your application on the cluster
		
		// Create a Spark Context object
		JavaSparkContext sc = new JavaSparkContext(conf);

		// print the application ID
		System.out.println("******************************");
		System.out.println("ApplicationId: "+JavaSparkContext.toSparkContext(sc).applicationId());
		System.out.println("******************************");
		
		// Read the content of the input file
		JavaRDD<String> inputRDD = sc.textFile(inputPath);

		// Task 1

		// Pay attention that the line starting with “Id,” is the header of the file and must not be considered. 
		JavaRDD<String> inputRDDfiltered = inputRDD.filter((line) -> !line.startsWith("Id") );

		JavaPairRDD<String, List<String>> userProductPairsRDD = inputRDDfiltered.mapToPair(
			line -> {
				String[] fields = line.split(",");
			    return new Tuple2<String, List<String>>(fields[2], new ArrayList<String>(Collections.singletonList(fields[1])));
			}
		).distinct();

		// inputTransposedPairs.saveAsTextFile(outputPath);

		JavaPairRDD<String, List<String>> userProductsPairRDD = userProductPairsRDD
		.reduceByKey((Function2<List<String>, List<String>, List<String>>) (list1, list2) -> {
			list1.addAll(list2);
			return list1;
		});
		
		//userProductsPairRDD.saveAsTextFile(outputPath);

		// Counts the frequency of each pair of products that have been reviewed together (the
        // frequency of a pair of products is given by the number of users who reviewed both products);
		JavaPairRDD<String, Integer> productPairsRDD = userProductsPairRDD.flatMapToPair(
			userProductsPair -> {
				List<Tuple2<String, Integer>> pairs = new ArrayList<>();
				List<String> products = userProductsPair._2;
				for (int i = 0; i < products.size(); i++) {
					for (int j = i + 1; j < products.size(); j++) {
						String product1 = products.get(i);
						String product2 = products.get(j);
						if(product1.compareTo(product2) > 0){
							pairs.add(new Tuple2<>(product2 + "," + product1, 1));
						}
						else{
							pairs.add(new Tuple2<>(product1 + "," + product2, 1));
						}	
					}
				}
				return pairs.iterator();
			}
		);

		JavaPairRDD<String, Integer> productPairsCountRDD = productPairsRDD.reduceByKey((v1, v2) -> v1 + v2);

		// Select only the pairs that appear more than once and their frequencies.
		JavaPairRDD<String, Integer> atLeast2PairsFrequencies = productPairsCountRDD.filter(t -> t._2() > 1);

		// Sort pairs by decreasing frequency
		JavaPairRDD<String, Integer> sortedFrequentProductPairsRDD = atLeast2PairsFrequencies
		.mapToPair(pair -> new Tuple2<>(pair._2(), pair._1()))
		.sortByKey(false)
		.mapToPair(pair -> new Tuple2<>(pair._2(), pair._1()));

		sortedFrequentProductPairsRDD.saveAsTextFile(outputPath);

		// write on the standard output the top 10, most frequent, pairs of products and their frequencies
		
		// Take the top 10 most frequent pairs
        List<Tuple2<String, Integer>> top10Pairs = sortedFrequentProductPairsRDD.take(10);

        // Print the top 10 pairs to the standard output
        for (Tuple2<String, Integer> pair : top10Pairs) {
            System.out.println("Pair: " + pair._1() + ", Frequency: " + pair._2());
        }

		// Store the result in the output folder
		// resultRDD.saveAsTextFile(outputPath);

		// Close the Spark context
		sc.close();
	}
}
