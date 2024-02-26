package it.polito.bigdata.spark;

import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaDStream;
import org.apache.spark.streaming.api.java.JavaPairDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;

import java.util.ArrayList;
import scala.Tuple2;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.JavaPairRDD;
	
public class SparkDriver {
	
	
	public static void main(String[] args) throws InterruptedException {

		
		String outputPathPrefix;
		String inputFolder;

		inputFolder = args[0];
		outputPathPrefix = args[1];
	
		// Create a configuration object and set the name of the application
		SparkConf conf=new SparkConf().setAppName("Spark Streaming Lab 10");
				
		// Create a Spark Streaming Context object
		JavaStreamingContext jssc = new JavaStreamingContext(conf, Durations.seconds(10));
		JavaSparkContext sc = jssc.sparkContext();

		// print the application ID
		System.out.println("******************************");
		System.out.println("ApplicationId: "+JavaSparkContext.toSparkContext(sc).applicationId());
		System.out.println("******************************");
		
		// Set the checkpoint folder (it is needed by some window transformations)
		jssc.checkpoint("checkpointfolder");

		// Read the streaming data
		JavaDStream<String> tweets = jssc.textFileStream(inputFolder);

		
		JavaPairDStream<String, Integer> hashtagsOnes = tweets.flatMapToPair( tweet -> {
			ArrayList<Tuple2<String, Integer>> hashtagsOnesList = new ArrayList<Tuple2<String, Integer>>();
			String[] fields = tweet.split("\t");
			String[] words = fields[1].split("\\s+");
			for (String word : words) {
				if(word.startsWith("#")){
					hashtagsOnesList.add(new Tuple2<String, Integer>(word, +1));
				}
				
			}
			return hashtagsOnesList.iterator();
		});

		JavaPairDStream<String, Integer> hashtagsCounts = hashtagsOnes.reduceByKeyAndWindow(
				// Function to perform aggregation over the last 30 seconds of data
				(Integer value1, Integer value2) -> {
					return value1 + value2;
				},
				// Window duration
				Durations.seconds(30),
				// Slide duration
				Durations.seconds(10)
		);

		// Select only 'relevant' hashtags, i.e., hashtags with a frequency greater than 100 in the last 30s
		JavaPairDStream<String, Integer> hashtagsCountsFiltered = hashtagsCounts.filter((Tuple2<String, Integer> pair) -> {
			return pair._2().intValue() >= 100;
		});
				

		// sort the content of the pairs by frequency
		JavaPairDStream<Integer, String> relevantCountsHashtagsSorted = hashtagsCountsFiltered
			.transformToPair((JavaPairRDD<String, Integer> rdd) -> {
				
				JavaPairRDD<Integer, String> swappedRDD = rdd.mapToPair((Tuple2<String, Integer> pair) -> {
					return new Tuple2<Integer, String>(pair._2(), pair._1());
				});
				return swappedRDD.sortByKey(false);
			});

		// Print on the standard output the top 10 hashtags for each time step.
		relevantCountsHashtagsSorted.print();
		
	    // Store the output of the computation in the folder with prefix outputPrefix
		relevantCountsHashtagsSorted.dstream().saveAsTextFiles(outputPathPrefix, "");

		// Start the computation
		jssc.start();              
		
		// Run the application for at most 120000 ms
		jssc.awaitTerminationOrTimeout(120000);
		
		jssc.close();
		
	}
}
