package it.polito.bigdata.spark.example;

import org.apache.spark.api.java.*;

import scala.Tuple2;

import org.apache.spark.SparkConf;

import java.util.Comparator;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;
	
public class SparkDriver {
	
	public static void main(String[] args) {

		// The following two lines are used to switch off some verbose log messages
		Logger.getLogger("org").setLevel(Level.OFF);
		Logger.getLogger("akka").setLevel(Level.OFF);


		String inputPath;
		String outputPath;
		String prefix;
		
		inputPath=args[0];
		outputPath=args[1];
		prefix=args[2];

	
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
		
		// Read the content of the input file/folder
		// Each element/string of wordFreqRDD corresponds to one line of the input data 
		// (i.e, one pair "word\tfreq")  
		JavaRDD<String> wordFreqRDD = sc.textFile(inputPath);

		
		//Task 1

		// Create a PairRDD in which each pair is composed by the word and the frequency
		JavaPairRDD<String, Integer> wordFreqPairRDD = wordFreqRDD.mapToPair(
				line -> {
					String[] fields = line.split("\t");
					return new Tuple2<String, Integer>(fields[0], Integer.parseInt(fields[1]));
				}
		);

		// Filter lines in order to keep only words starting with the prefix inserted by the user
		JavaPairRDD<String, Integer> selectedWordFreqPairRDD = wordFreqPairRDD.filter(
				wordFreq -> wordFreq._1().startsWith(prefix)
		);

		// Return the number of selected lines
		long numSelectedLines = selectedWordFreqPairRDD.count();

		// Return the maximum frequency among the selected lines
		long maxFreq = selectedWordFreqPairRDD.map(
				// Each element of the RDD is a pair (word, frequency)
				// Return the frequency
				wordFreq -> wordFreq._2()
		).max(Comparator.naturalOrder());

		System.out.println("Number of selected lines: " + numSelectedLines);
		System.out.println("Maximum frequency: " + maxFreq);



		// Task 2

		// filter to select only the most frequent words. Specifically, your application must select those
        // lines that contain words with a frequency (freq) greater than 80% of the maximum frequency (maxfreq) computed 
		// before. 
		JavaPairRDD<String, Integer> selectedMaxFreqRDD = selectedWordFreqPairRDD.filter(
			line -> {
				if (line._2() > 0.8 * maxFreq){
					return true;
				}
				return false;
			}
		);

		// selectedMaxFreqRDD.saveAsTextFile(outputPath);
		long numSelectedLines2 = selectedMaxFreqRDD.count();
		System.out.println("Number of selected lines: "+numSelectedLines2);

		JavaRDD<String> res = selectedMaxFreqRDD.keys();
		res.saveAsTextFile(outputPath);

		// Close the Spark context
		sc.close();
	}
}
