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
		

		// Task 1 - Meteorological summer 2015 - City average maximum temperature
		JavaRDD<String> summerCitiesTemperatures = sc.textFile(inputPath).filter(data -> {
			String[] fields = data.split(",");
			String date = fields[0];
			if(date.compareTo("2015/06/01")>=0 && date.compareTo("2015/08/31")<=0){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String,SumCountMaxTemp> cityCountrySumCountMaxTemp = summerCitiesTemperatures.mapToPair( data -> {
			String fields[] = data.split(",");
			String city = fields[1];
			String country = fields[2];
			Double maxTemp = Double.parseDouble(fields[3]);
			SumCountMaxTemp c = new SumCountMaxTemp(maxTemp, 1);
			return new Tuple2<String, SumCountMaxTemp>(city+"-"+country, c);
		});

		JavaPairRDD<String,SumCountMaxTemp> cityCountrySumCountMaxTempReduced = cityCountrySumCountMaxTemp.reduceByKey( (temp1, temp2) -> {
			SumCountMaxTemp c = new SumCountMaxTemp(temp1.sumTemp+temp2.sumTemp, temp1.count+temp2.count);
			return c;
		});

		JavaPairRDD<String, Double> cityCountryAvgMaxTemp = cityCountrySumCountMaxTempReduced.mapToPair(data -> {
			String city_country = data._1();
			Double sumTemp = data._2().sumTemp;
			Integer count = data._2().count;
			return new Tuple2<String,Double>(city_country, sumTemp/count);
		});

		cityCountryAvgMaxTemp.saveAsTextFile(outputPath1);

		// Task 2 - Meteorological summer 2015 - Hot cities
		JavaPairRDD<String, SumCountMaxTemp> countrySumCountMaxTemp = summerCitiesTemperatures.mapToPair(data -> {
			String fields[] = data.split(",");
			String country = fields[2];
			Double maxTemp = Double.parseDouble(fields[3]);
			SumCountMaxTemp c = new SumCountMaxTemp(maxTemp, 1);
			return new Tuple2<String,SumCountMaxTemp>(country, c);
		});

		JavaPairRDD<String, SumCountMaxTemp> countryAvgMaxTemp = countrySumCountMaxTemp.reduceByKey((c1, c2) -> {
			SumCountMaxTemp c = new SumCountMaxTemp(c1.sumTemp+c2.sumTemp, c1.count+c2.count);
			return c;
		});

		JavaPairRDD<String, CitySumCountMaxTemp> countryCityAvgMaxTemp = cityCountrySumCountMaxTempReduced.mapToPair(data ->{
			String[] city_country = data._1().split("-");
			String city = city_country[0];
			String country = city_country[1];
			Double sumTemp = data._2().sumTemp;
			Integer count = data._2().count;
			CitySumCountMaxTemp c = new CitySumCountMaxTemp(city, sumTemp, count);
			return new Tuple2<String, CitySumCountMaxTemp>(country, c);
		});

		JavaPairRDD<String, Tuple2<CitySumCountMaxTemp, SumCountMaxTemp>> city_country_sum_count_maxTemp = countryCityAvgMaxTemp.join(countryAvgMaxTemp);

		JavaPairRDD<String, Tuple2<CitySumCountMaxTemp, SumCountMaxTemp>> city_country_sum_count_maxTemp_filtered = city_country_sum_count_maxTemp.filter(data->{
			Double avgCity = data._2()._1().sumTemp/data._2()._1().count;
			Double avgCountry = data._2()._2().sumTemp/data._2()._2().count;
			if(avgCity-avgCountry>=5){
				return true;
			}
			else{
				return false;
			}
		});

		JavaRDD<String> hotCities = city_country_sum_count_maxTemp_filtered.map(data -> {
			return data._2()._1().city;
		});

		hotCities.saveAsTextFile(outputPath2);

		// Close the Spark context 
		sc.close();
	}
}
