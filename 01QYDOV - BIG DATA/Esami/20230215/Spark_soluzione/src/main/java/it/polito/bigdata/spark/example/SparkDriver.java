package it.polito.bigdata.spark.example;

import org.apache.spark.api.java.*;
import org.apache.spark.SparkConf;

import java.util.ArrayList;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import scala.Tuple2;
	
public class SparkDriver {
	
	public static void main(String[] args) {

		// The following two lines are used to switch off some verbose log messages
		Logger.getLogger("org").setLevel(Level.OFF);
		Logger.getLogger("akka").setLevel(Level.OFF);

		String inputPathHouses;
		String inputPathMonthlyWaterConsumption;
		String outputPath1;
		String outputPath2;

		inputPathHouses = args[0];
		inputPathMonthlyWaterConsumption = args[1];
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
		JavaRDD<String> waterConsumption = sc.textFile(inputPathMonthlyWaterConsumption).cache();

		JavaRDD<String> waterConsumption21_22 = waterConsumption.filter(line -> {
			String[] fields = line.split(",");
			String month_year = fields[1];
			if(month_year.startsWith("2021") || month_year.startsWith("2022")){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, Double> houseID_thrimester_year_waterConsumption = waterConsumption21_22.mapToPair(line->{
			String[] fields = line.split(",");
			String houseID = fields[0];
			String year_month= fields[1];
			String year = year_month.split("/")[0];
			int month = Integer.parseInt(year_month.split("/")[1]);
			double water_consumption = Double.parseDouble(fields[2]);
			int trimester = 0;
			if(month>0 && month<=3){
				trimester = 1;
			}
			else if(month>3 && month<=6){
				trimester = 2;
			}
			else if(month>6 && month<=9){
				trimester = 3;
			}
			else{
				trimester = 4;
			}
			return new Tuple2<String, Double>(houseID+"-"+year+"-"+trimester, water_consumption);
		});


		JavaPairRDD<String, Double> houseID_thrimester_year_totWaterConsumption = houseID_thrimester_year_waterConsumption.reduceByKey((num1, num2)->new Double(num1+num2));

		JavaPairRDD<String, YearWaterConsumption> houseId_trimester_waterConsumption = houseID_thrimester_year_totWaterConsumption.mapToPair(pair->{
			String[] fields = pair._1().split("-");
			String houseID = fields[0];
			String year = fields[1];
			String trimester = fields[2];
			double water_consumption = pair._2();
			YearWaterConsumption ywc = new YearWaterConsumption(year, water_consumption);
			return new Tuple2<String, YearWaterConsumption>(houseID+"-"+trimester, ywc);
		});

		JavaPairRDD<String, YearWaterConsumption> houseId_thrimester_differenceByYears = houseId_trimester_waterConsumption.reduceByKey((ywc1,ywc2) -> {
			YearWaterConsumption ywc;
			if(ywc1.getYear().compareTo(ywc2.getYear())>0){
				ywc = new YearWaterConsumption(null, ywc1.getWaterConsumption()-ywc2.getWaterConsumption());
			}
			else{
				ywc = new YearWaterConsumption(null, ywc2.getWaterConsumption()-ywc1.getWaterConsumption());
			}	
			return ywc;
		});

		JavaPairRDD<String, YearWaterConsumption> houseId_thrimester_WaterConsumptionGreaterin2022 = houseId_thrimester_differenceByYears.filter(pair -> {
			if(pair._2.getWaterConsumption()>0){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, Integer> houseId_onesForThrimesterWithGreaterConsumptionIn2022 = houseId_thrimester_WaterConsumptionGreaterin2022.mapToPair(pair->{
			String[] fields = pair._1().split("-");
			String houseID = fields[0];
			return new Tuple2<String, Integer>(houseID, 1);
		});

		JavaPairRDD<String, Integer> houseId_atLeastThreeTrimesterWithGreaterConsumption = houseId_onesForThrimesterWithGreaterConsumptionIn2022
																			  .reduceByKey((num1,num2)->new Integer(num1+num2))
																			  .filter(pair -> pair._2()>=3);

		JavaPairRDD<String, String> houseId_cities = sc.textFile(inputPathHouses).mapToPair(line->{
			String[] fields = line.split(",");
			String houseId = fields[0];
			String city = fields[1];
			return new Tuple2<String, String> (houseId, city);
		});
		
		JavaPairRDD<String, String> result = houseId_cities.join(houseId_atLeastThreeTrimesterWithGreaterConsumption).mapToPair(pair->{
			return new Tuple2<String, String>(pair._1(), pair._2()._1());
		});

		result.saveAsTextFile(outputPath1);

		// Task 2
		JavaPairRDD<String, Double> houseID_year_annualWaterConsumption = waterConsumption.mapToPair(line ->{
			String[] fields = line.split(",");
			String houseID = fields[0];
			String year_month = fields[1];
			String year = year_month.split("/")[0];
			double water_consumption = Double.parseDouble(fields[2]);
			return new Tuple2<String, Double>(houseID+"-"+year, water_consumption); 
		}).reduceByKey((num1, num2)-> new Double(num1+num2));


		JavaPairRDD<Tuple2<String, Integer>, Tuple2<Double, Integer>> elementsWindow = houseID_year_annualWaterConsumption.flatMapToPair(pair->{
			String houseId_year = pair._1();
			String houseID = houseId_year.split("-")[0];
			Integer year = Integer.parseInt(houseId_year.split("-")[1]);
			double annual_consumption = pair._2();

			ArrayList<Tuple2<Tuple2<String, Integer>, Tuple2<Double, Integer>>> pairs = new ArrayList<Tuple2<Tuple2<String, Integer>, Tuple2<Double, Integer>>>();
			pairs.add(new Tuple2<>(new Tuple2<>(houseID, year), new Tuple2<>(annual_consumption, 1)));
			pairs.add(new Tuple2<>(new Tuple2<>(houseID, year+1), new Tuple2<>(-annual_consumption, 1)));
			return pairs.iterator();
		});

		JavaPairRDD<Tuple2<String, Integer>, Tuple2<Double, Integer>> windowsElementsAndSumConsumptions = elementsWindow.reduceByKey((p1, p2) -> {
			return new Tuple2<Double, Integer>(p1._1()+p2._1(), p1._2()+p2._2());
		});

		JavaPairRDD<Tuple2<String, Integer>, Tuple2<Double, Integer>> selectedWindows = windowsElementsAndSumConsumptions.filter(pair ->{
			if(pair._2()._2()==2 && pair._2()._1()<0){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, Integer> housesAtLeastOneDecrease = selectedWindows.mapToPair(pair -> {
			return new Tuple2<String, Integer>(pair._1()._1(), 1);
		}).distinct();

		JavaRDD<String> citiesWithDecreasing = housesAtLeastOneDecrease.join(houseId_cities)
																		       .mapToPair(pair -> new Tuple2<>(pair._2()._2(), 1))
																			   .reduceByKey((num1, num2) -> num1+num2)
																			   .filter(pair->pair._2()>2).keys();
		
		JavaRDD<String> citiesResult = houseId_cities.values().subtract(citiesWithDecreasing).distinct();

		citiesResult.saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
