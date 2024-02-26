package it.polito.bigdata.spark;

import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaDStream;
import org.apache.spark.streaming.api.java.JavaPairDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;

import scala.Tuple2;

import java.util.ArrayList;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;

public class SparkDriver {

	@SuppressWarnings("resource")
	public static void main(String[] args) throws InterruptedException {

		String outputPathPrefix;
		String inputFolder;

		inputFolder = args[0];
		outputPathPrefix = args[1];

		// Create a configuration object and set the name of the application
		SparkConf conf = new SparkConf().setAppName("Spark Streaming Lab 10");

		// Create a Spark Streaming Context object
		JavaStreamingContext jssc = new JavaStreamingContext(conf, Durations.seconds(10));

		// Set the checkpoint folder (it is needed by some window
		// transformations)
		jssc.checkpoint("checkpointfolder");

		// Read the streaming data from inputFolder
		JavaDStream<String> tweets = jssc.textFileStream(inputFolder);

		// Extract hashtags from the text of the tweets
		// Return one pair (hashtag,+1) for each identified hasntag
		JavaPairDStream<String, Integer> hashtagsOne  = tweets.flatMapToPair(tweet -> {
			ArrayList<Tuple2<String, Integer>> hastags = new ArrayList<Tuple2<String, Integer>>();
			String[] fields = tweet.split("\t");

			String text = fields[1];

			String[] words = text.split("\\s+");

			// Extract the hashtags appearing in this tweet
			for (String word : words) {
				if (word.startsWith("#")) {
					hastags.add(new Tuple2<String, Integer>(word, +1));
				}
			}

			// Return the list of hastags of this tweet
			return hastags.iterator();
		});

		// reduceByKeyAndWindow is used instead of reduceByKey
		// The characteristics of the window is also specified
		JavaPairDStream<String, Integer> hashtagsCounts = hashtagsOne.reduceByKeyAndWindow((Integer i1, Integer i2) -> {
			return i1 + i2;
		}, Durations.seconds(30), Durations.seconds(10));

		// Sort the content of the pairs by value
		JavaPairDStream<Integer, String> hashtagsCountsSorted = hashtagsCounts
				.transformToPair((JavaPairRDD<String, Integer> rdd) -> {
					// Swap keys with values and then sort the RDD by key
					JavaPairRDD<Integer, String> swapRDD = rdd.mapToPair((Tuple2<String, Integer> element) -> {
						return new Tuple2<Integer, String>(element._2(), element._1());
					});

					// Sort by key - descending order
					return swapRDD.sortByKey(false);
				});

		// Print on the standard output the first 10 hastags + num. of
		// occurrences
		hashtagsCountsSorted.print();

		// Store the output of the computation in the folders with prefix
		// outputPathPrefix
		hashtagsCountsSorted.dstream().saveAsTextFiles(outputPathPrefix, "");

		// Start the computation
		jssc.start();

		// Run the application for at most 120000 ms
		jssc.awaitTerminationOrTimeout(120000);

		jssc.close();

	}
}














