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
		JavaRDD<String> POIs = sc.textFile(inputPath).cache();

		JavaRDD<String> citiesWithTaxiPOIs = POIs.filter(line->{
			String[] fields = line.split(",");
			String country = fields[4];
			String subcategory = fields[6];
			if(subcategory.compareTo("taxi")==0 && country.compareTo("Italy")==0){
				return true;
			}
			else{
				return false;
			}
		});

		JavaRDD<String> citiesIdsWithTaxiPOIs = citiesWithTaxiPOIs.map(line->{
			String[] fields = line.split(",");
			String city = fields[3];
			return city;
		});

		JavaRDD<String> citiesWithBusstopPOIs = POIs.filter(line->{
			String[] fields = line.split(",");
			String country = fields[4];
			String subcategory = fields[6];
			if(subcategory.compareTo("busstop")==0 && country.compareTo("Italy")==0){
				return true;
			}
			else{
				return false;
			}
		});

		JavaRDD<String> citiesIdsWithBusstopPOIs = citiesWithBusstopPOIs.map(line->{
			String[] fields = line.split(",");
			String city = fields[3];
			return city;
		});

		citiesIdsWithTaxiPOIs.subtract(citiesIdsWithBusstopPOIs).distinct().saveAsTextFile(outputPath1);

		// Task 2

		JavaRDD<String> citiesWithMuseums = POIs.filter(line->{
			String[] fields = line.split(",");
			String country = fields[4];
			if(country.compareTo("Italy")==0){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, Integer> cities_museums_ones = citiesWithMuseums.mapToPair(line->{
			String[] fields = line.split(",");
			String city = fields[3];
			String subcategory = fields[6];
			if(subcategory.compareTo("museum")==0){
				return new Tuple2<String, Integer>(city, 1);
			}
			else{
				return new Tuple2<String, Integer>(city, 0);
			}
		});

		// For each city I have the number of museums
		JavaPairRDD<String, Integer> cities_museums_aggregated = cities_museums_ones.reduceByKey((cmn1, cmn2)-> cmn1+cmn2);

		JavaRDD<CitiesMuseumsNum> citiesMuseumsOnes = cities_museums_aggregated.map(pair -> {
			CitiesMuseumsNum cmn = new CitiesMuseumsNum(pair._2(), 1);
			return cmn;
		});
		
		// Total number of cities and museums
		CitiesMuseumsNum cms = citiesMuseumsOnes.reduce((cmn1, cmn2)->{
			CitiesMuseumsNum cmn = new CitiesMuseumsNum(cmn1.numMuseums+cmn2.numMuseums, cmn1.numCities+cmn2.numCities);
			return cmn;
		});

		double average = (double) cms.numMuseums / (double) cms.numCities;

		JavaPairRDD<String, Integer> citiesWithManyMuseums = cities_museums_aggregated.filter(pair -> {
			if(pair._2()>average){
				return true;
			}
			else{
				return false;
			}
		});

		citiesWithManyMuseums.keys().saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
