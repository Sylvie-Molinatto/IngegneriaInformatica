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

		String inputPathDailyPowerConsumption;
		String inputPathHouses;
		String outputPath1;
		String outputPath2;

		inputPathDailyPowerConsumption = args[0];
		inputPathHouses = args[1];
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
		

		// Task 1
		JavaRDD<String> dailyPowerConsumption = sc.textFile(inputPathDailyPowerConsumption);

		JavaRDD<String> dailyPowerConsumption2022 = dailyPowerConsumption.filter(line->{
			String[] fields = line.split(",");
			String date = fields[1];
			if(date.startsWith("2022")){
			return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, CounterConsumption> houseId_CounterConsumption_ones = dailyPowerConsumption2022.mapToPair(line -> {
			String[] fields = line.split(",");
			String houseID = fields[0];
			Double dpc = Double.parseDouble(fields[2]);
			CounterConsumption cc = new CounterConsumption(dpc, 1);
			return new Tuple2<String, CounterConsumption>(houseID, cc);
		});

		JavaPairRDD<String, CounterConsumption> houseId_CounterConsumption = houseId_CounterConsumption_ones.reduceByKey((cc1,cc2)->{
			CounterConsumption cc = new CounterConsumption(cc1.getPowerConsumption()+cc2.getPowerConsumption(), cc1.getCount()+cc2.getCount());
			return cc;
		});

		JavaPairRDD<String, CounterConsumption> houseId_highAvgDailyConsumption = houseId_CounterConsumption.filter(pair->{
			double powerConsumption = pair._2().getPowerConsumption();
			int count = pair._2().getCount();
			double avg = powerConsumption/(double) count;
			if(avg>30){ 
				return true;
			}
			else{
			return false;
			}
		});

		JavaRDD<String> countries = sc.textFile(inputPathHouses);

		JavaRDD<String> countries_names = countries.map(line -> {
			String[] fields = line.split(",");
			String country = fields[2];
			return country;
		}).distinct();

		JavaPairRDD<String, String> houseId_country = countries.mapToPair(line -> {
			String[] fields = line.split(",");
			String houseId = fields[0];
			String country = fields[2];
			return new Tuple2<String, String>(houseId, country);
		});

		// Here we have the houses with a high average daily consumption in 2022 with the respective countries
		// (houseId, (countryId, CounterConsumption))
		JavaPairRDD<String, Tuple2<String, CounterConsumption>> houseId_countryId_powerConsumption = houseId_country.join(houseId_highAvgDailyConsumption);

		// I retrieve just the country of this houses
		JavaRDD<String> countriesWithHousesHighAvgDailyConsumption = houseId_countryId_powerConsumption.map(pair-> pair._2()._1()).distinct();

		// Now I calculate the difference between all countries and the ones with houses with a high average daily consumption in 2022
		JavaRDD<String> countriesWithoutHousesHighAvgDailyConsumption = countries_names.subtract(countriesWithHousesHighAvgDailyConsumption);

		countriesWithoutHousesHighAvgDailyConsumption.saveAsTextFile(outputPath1);

		// Task 2
		JavaRDD<String> dailyPowerConsumption2021 = dailyPowerConsumption.filter(line->{
			String fields[] = line.split(",");
			String date = fields[1];
			if(date.startsWith("2021")){
			   return true;
			}	
			else{
			  return false;
			}
		});
		
		JavaPairRDD<String, Double> houseId_powerDailyConsumption = dailyPowerConsumption2021.mapToPair(line -> {
			String[] fields = line.split(",");
			String houseID = fields[0];
			double powerDailyConsumption = Double.parseDouble(fields[2]);
				return new Tuple2<String, Double>(houseID, powerDailyConsumption);
		});
		
		JavaPairRDD<String, Double> houseId_powerAnnualConsumption = houseId_powerDailyConsumption.reduceByKey((pdc1, pdc2) -> new Double(pdc1+pdc2));
		
		JavaPairRDD<String, Double> houseId_highAnnualPowerConsumption = houseId_powerAnnualConsumption.filter(pair -> pair._2()>10000);
		
		JavaPairRDD<String, CityCountry> houseId_city_country = countries.mapToPair(line -> {
			String[] fields = line.split(",");
			String houseID = fields[0];
			String city = fields[1];
			String country = fields[2];
			CityCountry cc = new CityCountry(city, country);
			return new Tuple2<String, CityCountry>(houseID, cc);
		});
		
		// (houseId, (cityCountry, annualPowerConsumption)
		JavaPairRDD<String, Tuple2<CityCountry, Double>> houseId_city_country_highAnnualPowerConsumption = houseId_city_country.join(houseId_highAnnualPowerConsumption);
		
		JavaPairRDD<String, Integer> country_city_numHousesHighConsumption = houseId_city_country_highAnnualPowerConsumption.mapToPair(pair->{
			String city = pair._2()._1().getCity();
			String country = pair._2()._1().getCountry();
			return new Tuple2<String, Integer>(country+"-"+city, 1);
		}).reduceByKey((num1, num2) -> new Integer(num1+num2)); 
		
		JavaPairRDD<String, Integer> country_city_manyHousesHighConsumption = country_city_numHousesHighConsumption.filter(pair->pair._2()>500);
		
		JavaPairRDD<String, Integer> country_numCitiesWithManyHighConsumptionHouses = country_city_manyHousesHighConsumption.mapToPair(pair -> {
			String country_city = pair._1();
			String country = country_city.split("-")[0];
			return new Tuple2<String, Integer>(country, 1);
		}).reduceByKey((num1, num2)-> new Integer(num1+num2));
		
		JavaPairRDD<String, Integer> countriesWithoutCitiesWithManyHighConsumptionHouses = countries.map(line->{
			String country = line.split(",")[2];
			return country;
		}).distinct().subtract(country_numCitiesWithManyHighConsumptionHouses.keys().distinct()).mapToPair(line ->{
			String country = line;
			return new Tuple2<String, Integer>(country, 0);
		});
		
		JavaPairRDD<String, Integer> country_numCities = country_numCitiesWithManyHighConsumptionHouses.union(countriesWithoutCitiesWithManyHighConsumptionHouses);
		
		country_numCities.saveAsTextFile(outputPath2);
		

		// Close the Spark context
		sc.close();
	}
}
