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
		JavaRDD<String> watchedMovies = sc.textFile(inputPath).cache();

		JavaRDD<String> watchedMoviesFiltered = watchedMovies.filter(line->{
			String[] fields = line.split(",");
			String date = fields[2];
			if(date.compareTo("2015/09/17")>=0 && date.compareTo("2020/09/16")<=0){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, Integer> mid_year= watchedMoviesFiltered.mapToPair(line->{
			String fields[] = line.split(",");
			String mid = fields[1];
			String date = fields[2];
			int year = Integer.parseInt(date.split("/")[0]);
			return new Tuple2<String, Integer>(mid, year);
		}).distinct();

		JavaPairRDD<String, Integer> mid_yearOnes = mid_year.mapValues(year -> 1);

		JavaPairRDD<String, Integer> mid_numYears = mid_yearOnes.reduceByKey((num1,num2)->num1+num2);

		JavaPairRDD<String, Integer> mid_oneYear = mid_numYears.filter(pair->pair._2()==1);

		JavaPairRDD<String, Integer> mid_year_ones = watchedMoviesFiltered.mapToPair(line->{
			String[] fields = line.split(",");
			String mid = fields[1];
			String date = fields[2];
			String year = date.split("/")[0];
			return new Tuple2<String, Integer>(mid+"-"+year,1);
		});

		JavaPairRDD<String, Integer> mid_year_numWatchings = mid_year_ones.reduceByKey((num1,num2)->num1+num2);
		JavaPairRDD<String, Integer> mid_year_numWatchingGreatherThan1000 = mid_year_numWatchings.filter(pair->pair._2()>=4);

		JavaPairRDD<String, Integer> mid_numWatchingGreatherThan1000 = mid_year_numWatchingGreatherThan1000.mapToPair(pair->{
			String mid = pair._1().split("-")[0];
			Integer year = Integer.parseInt(pair._1().split("-")[1]);
			return new Tuple2<String, Integer>(mid, year);
		});

		JavaPairRDD<String, Tuple2<Integer, Integer>> mid_numWatching_oneYear = mid_numWatchingGreatherThan1000.join(mid_oneYear);

		JavaPairRDD<String, Integer> result = mid_numWatching_oneYear.mapToPair(pair->{
			return new Tuple2<String,Integer>(pair._1(),pair._2()._1());
		});
		
		result.saveAsTextFile(outputPath1);
		
		// Task 2

		JavaRDD<String> mid_user_year = watchedMovies.map(line->{
			String fields[] = line.split(",");
			String user = fields[0];
			String mid = fields[1];
			String date = fields[2];
			String year = date.substring(0,4);
			return new String(mid+"-"+user+"-"+year);
		}).distinct(); 

		JavaPairRDD<String, Integer> mid_year_ones_noDuplicatedUsers = mid_user_year.mapToPair(line->{
			String[] fields = line.split("-");
			String mid = fields[0];
			String year = fields[2];
			return new Tuple2<String, Integer>(mid+"-"+year, 1);
		});

		JavaPairRDD<String, Integer> mid_year_numWatchingsDifferentUsers = mid_year_ones_noDuplicatedUsers.reduceByKey((num1,num2)->num1+num2);

		JavaPairRDD<String, Integer> yearMaxPopularity = mid_year_numWatchingsDifferentUsers.mapToPair(pair->{
			String[] fields = pair._1().split("-");
			String year = fields[1];
			return new Tuple2<String, Integer>(year,pair._2());
		}).reduceByKey((num1,num2)->{
			if(num1>num2){
				return num1;
			}
			else{
				return num2;
			}
		});

		JavaPairRDD<String, MovieWatchings> year_movieWhatchings = mid_year_numWatchingsDifferentUsers.mapToPair(pair->{
			String mid = pair._1().split("-")[0];
			String year = pair._1().split("-")[1];
			MovieWatchings mw = new MovieWatchings(mid, pair._2());
			return new Tuple2<String, MovieWatchings>(year, mw);
		});

		// (year, ((mid, numWatchings), max_popularity))
		JavaPairRDD<String, Tuple2<MovieWatchings, Integer>> year_mid_numWatchings_maxPopularity = year_movieWhatchings.join(yearMaxPopularity);

		JavaPairRDD<String, Tuple2<MovieWatchings, Integer>> year_mid_numWatchings_maxPopularity_filter = year_mid_numWatchings_maxPopularity.filter(pair->{
			if(pair._2()._1().numWatchings==pair._2()._2()){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, Integer> movies_onesPopular = year_mid_numWatchings_maxPopularity_filter.mapToPair(pair->{
			String mid = pair._2()._1().mid;
			return new Tuple2<String, Integer>(mid, 1);
		});

		JavaPairRDD<String, Integer> movies_popularity = movies_onesPopular.reduceByKey((num1,num2)->num1+num2);

		JavaPairRDD<String, Integer> popularMovies = movies_popularity.filter(pair->pair._2()>1);

		popularMovies.keys().saveAsTextFile(outputPath2);

		



		

		// Close the Spark context
		sc.close();
	}
}
