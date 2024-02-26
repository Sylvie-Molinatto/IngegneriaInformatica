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
		Double PrecThr;
		Double WindThr;
		String outputPath1;
		String outputPath2;

		inputPath = args[0];
		PrecThr = Double.parseDouble(args[1]);
		WindThr = Double.parseDouble(args[2]);
		outputPath1 = args[3];
		outputPath2 = args[4];
	
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
		JavaRDD<String> climateData = sc.textFile(inputPath);

		JavaRDD<String> climateDataFiltered = climateData.filter(line->{
			String[] fields = line.split(",");
			String date = fields[1];
			if(date.compareTo("01/04/2018")>=0 && date.compareTo("31/05/2018")<=0){
				return true;
			}
			else{
				return false;
			}
		}).cache();

		JavaPairRDD<String, PrecipitationsDetails> sensorDatePrecipitationDetails = climateDataFiltered.mapToPair(line->{
			String[] fields = line.split(",");
			String SID = fields[0];
			String date = fields[1];
			String hour = fields[2].split(":")[0];
			Double precipitation_mm = Double.parseDouble(fields[3]);
			Double wind_speed = Double.parseDouble(fields[4]);
			PrecipitationsDetails pd = new PrecipitationsDetails(precipitation_mm, wind_speed, 1);
			return new Tuple2<String, PrecipitationsDetails>(SID+"-"+hour, pd);
		});

		JavaPairRDD<String, PrecipitationsDetails> sensorsDateAggregatedPrecipitationDetails = sensorDatePrecipitationDetails.reduceByKey((pd1, pd2)->{
			return new PrecipitationsDetails(pd1.precipitation_mm+pd2.precipitation_mm, pd1.wind_speed+pd2.wind_speed, pd1.count+pd2.count);
		});

		JavaPairRDD<String, PrecipitationsDetails> criticalPairs = sensorsDateAggregatedPrecipitationDetails.filter(pair->{
			
			double avg_precipitation_mm = (double) pair._2().precipitation_mm / (double) pair._2().count;
			double avg_wind_speed = (double) pair._2().wind_speed / (double) pair._2().count;

			if(avg_precipitation_mm<PrecThr && avg_wind_speed<WindThr){
				return true;
			}
			else{
				return false;
			}
		});

		criticalPairs.keys().saveAsTextFile(outputPath1);

		// Task 2
		JavaPairRDD<String, Double> sensorDateHourWindSpeed = climateDataFiltered.mapToPair(line->{
			String[] fields = line.split(",");
			String SID = fields[0];
			String date = fields[1];
			String hour = fields[2].split(":")[0];
			Double wind_speed = Double.parseDouble(fields[4]);
			return new Tuple2<String,Double>(SID+"-"+date+"-"+hour, wind_speed);
		});

		JavaPairRDD<String, Double> sensorDateHourMinWindSpeed = sensorDateHourWindSpeed.reduceByKey((pd1,pd2)->{
			double min_wind_speed;

			if(pd1.doubleValue()<=pd2.doubleValue()){
				min_wind_speed = pd1.doubleValue();
			}
			else{
				min_wind_speed = pd2.doubleValue();
			}

			return min_wind_speed;
		});

		JavaPairRDD<String, Double> sensorsDateHourMinWindSpeedFiltered = sensorDateHourMinWindSpeed.filter(pair->{
			if(pair._2().doubleValue()<1 || pair._2().doubleValue()>40){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, Requirements> sensorDateNumberUnbalancedHours = sensorDateHourMinWindSpeed.mapToPair(pair->{
			String SID_date_hour = pair._1();
			String fields[] = SID_date_hour.split("-");
			Double min_wind_speed = pair._2().doubleValue();

			int lessThan1=0;
			int greaterThan40=0;
			if(min_wind_speed<1){
				lessThan1 = 1;
			}
			else {
				greaterThan40 = 1;
			}

			Requirements r = new Requirements(lessThan1, greaterThan40);
			return new Tuple2<String, Requirements>(fields[0]+"-"+fields[1], r);
		});

		JavaPairRDD<String, Requirements> sensorDateNumberUnbalancedHoursAggregated = sensorDateNumberUnbalancedHours.reduceByKey((r1,r2)->{
			Requirements r = new Requirements(r1.lessThan1+r2.lessThan1, r1.greaterThan40+r2.greaterThan40);
			return r;
		});

		JavaPairRDD<String, Requirements> unbalancedPairs = sensorDateNumberUnbalancedHoursAggregated.filter(pair->{
			if(pair._2().lessThan1>=5 && pair._2().greaterThan40>=5){
				return true;
			}
			else{
				return false;
			}
		});

		unbalancedPairs.keys().saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
