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

		String inputPathCustomers;
		String inputPathCustomerWatched;
		String inputPathEpisodes;
		String inputPathTVSeries;
		String outputPath1;
		String outputPath2;

		inputPathCustomers = args[0];
		inputPathCustomerWatched = args[1];
		inputPathEpisodes = args[2];
		inputPathTVSeries = args[3];
		outputPath1 = args[4];
		outputPath2 = args[5];
	
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
		JavaRDD<String> tvSeries = sc.textFile(inputPathTVSeries);

		// filter out non comedy tv series
		// key: SID, value: genre
		JavaPairRDD<String, String> comedyTVSeries = tvSeries.filter(line -> {
			String[] fields = line.split(",");
			String genre = fields[2];
			if(genre.equals("comedy")){
				return true;
			}
			else{
				return false;
			}
		}).mapToPair(line->{
			String[] fields = line.split(",");
			String sid = fields[0];
			String genre = fields[2];
			return new Tuple2<String, String>(sid, genre);
		});

		// key: SID-seasonNumber, value: 1
		JavaPairRDD<String, Integer> episodes = sc.textFile(inputPathEpisodes).mapToPair(line -> {
			String[] fields = line.split(",");
			String sid = fields[0];
			String seasonNumber = fields[1];
			return new Tuple2<String, Integer>(sid+"-"+seasonNumber, 1);
		});

		JavaPairRDD<String, Integer> sid_seasonNumber_numEpisodes = episodes.reduceByKey((num1, num2)->num1+num2);

		JavaPairRDD<String, SeasonEpisodesCount> sid_seasonEpisodesCount = sid_seasonNumber_numEpisodes.mapToPair(pair->{
			String sid_seasonNumber = pair._1();
			String sid = sid_seasonNumber.split("-")[0];
			SeasonEpisodesCount sec = new SeasonEpisodesCount(1, pair._2());
			return new Tuple2<String, SeasonEpisodesCount>(sid, sec);
		});

		JavaPairRDD<String, SeasonEpisodesCount> sid_seasonEpisodesCountAggregated = sid_seasonEpisodesCount.reduceByKey((sec1, sec2) -> {
			return new SeasonEpisodesCount(sec1.seasonCount+sec2.seasonCount, sec1.episodesCount+sec2.episodesCount);
		});

		JavaPairRDD<String, SeasonEpisodesCount> result = sid_seasonEpisodesCountAggregated.join(comedyTVSeries).mapToPair(pair -> {
			return new Tuple2<String, SeasonEpisodesCount>(pair._1(), pair._2()._1());
		});

		result.saveAsTextFile(outputPath1);

		// Task 2
		JavaPairRDD<String, Integer> customersWatched = sc.textFile(inputPathCustomerWatched).mapToPair(line -> {
			String fields[] = line.split(",");
			String cid = fields[0];
			String sid = fields[2];
			String seasonNumber = fields[3];
			return new Tuple2<String, Integer>(cid+"-"+sid+"-"+seasonNumber, 1);
		});


		JavaPairRDD<String, Integer> cid_sid_seasonNumber_watched = customersWatched.reduceByKey((num1, num2)->new Integer(1));

		JavaPairRDD<String, Integer> cid_sid_numSeasonsWatched = cid_sid_seasonNumber_watched.mapToPair(pair -> {
			String[] fields = pair._1().split("-");
			String cid = fields[0];
			String sid = fields[1];
			return new Tuple2<String, Integer>(cid+"-"+sid, 1);
		}).reduceByKey((num1, num2)-> num1+num2);

		JavaPairRDD<String, Tuple2<String, Integer>> sid_cid_numSeasonsWatched = cid_sid_numSeasonsWatched.mapToPair(pair->{
			String fields[] = pair._1().split("-");
			String cid = fields[0];
			String sid = fields[1];
			return new Tuple2<>(sid, new Tuple2<>(cid, pair._2()));
		});

		// JavaPairRDD<String, Tuple2<Tuple2<<String, Integer>, SeasonEpisodedCount>>
		JavaPairRDD<String, Tuple2<String, Integer>> sid_cid_numSeasonsWatched_numTotalSeason = sid_cid_numSeasonsWatched.join(sid_seasonEpisodesCountAggregated).mapToPair(pair->{
			String sid = pair._1();
			String cid = pair._2()._1()._1();
			int watchedSeasons = pair._2()._1()._2();
			int totalSeasons = pair._2()._2().seasonCount;
			return new Tuple2<String, Tuple2<String, Integer>>(sid, new Tuple2<>(cid, totalSeasons-watchedSeasons));
		});

		JavaPairRDD<String, String> sid_watchedOneEpisodeForSeason = sid_cid_numSeasonsWatched_numTotalSeason.filter(pair->{
			if(pair._2()._2()==0){
				return true;
			}
			else{
				return false;
			}
		}).mapToPair(pair -> new Tuple2<String, String>(pair._1(), pair._2()._1()));

		sid_watchedOneEpisodeForSeason.saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
