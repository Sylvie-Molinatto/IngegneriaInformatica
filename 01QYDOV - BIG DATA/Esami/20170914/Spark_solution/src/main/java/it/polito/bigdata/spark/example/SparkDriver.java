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

		String inputPathFlights;
		String inputPathAirports;
		String outputPath1;
		String outputPath2;

		inputPathAirports = args[0];
		inputPathFlights = args[1];
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
		

		// Task 1 - Airlines with delayed flights landing in Germany
		JavaRDD<String> flights = sc.textFile(inputPathFlights);

		JavaRDD<String> delayedFlights = flights.filter(line -> {
			String[] fields = line.split(",");
			Integer delay = Integer.parseInt(fields[7]);
			if(delay>=15){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, String> airportDelayedFlights = delayedFlights.mapToPair(line -> {
			String fields[] = line.split(",");
			String airline = fields[1];
			String arrival_airport = fields[6];
			return new Tuple2<String, String>(arrival_airport, airline);
		});

		JavaRDD<String> airports = sc.textFile(inputPathAirports).filter(line -> {
			String[] fields = line.split(",");
			String country = fields[3];
			if(country.compareTo("Germany")==0){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, String> airportsNames = airports.mapToPair(line -> {
			String[] fields = line.split(",");
			String airportId = fields[0];
			String name = fields[1];
			return new Tuple2<String,String>(airportId, name);
		});

		// (airport_id, airline)
		// (airport_id, name)
		// JOIN --> airport_id, (airline, name)

		JavaPairRDD<String, Tuple2<String, String>> airportsNamedDelayedFlights = airportDelayedFlights.join(airportsNames);

		JavaPairRDD<String, Integer> airline_airport_1 = airportsNamedDelayedFlights.mapToPair(data -> {
			String airline = data._2()._1();
			String name = data._2()._2();
			return new Tuple2<String, Integer>("("+airline+", "+name+")", 1);
		});

		JavaPairRDD<String, Integer> airline_airport_delayedFlights = airline_airport_1.reduceByKey( (flight1, flight2) -> {
			return flight1.intValue()+flight2.intValue();
		});

		JavaPairRDD<Integer, String> delayedFlights_airline_airport = airline_airport_delayedFlights.mapToPair(data -> {
			return new Tuple2<Integer,String>(data._2(), data._1());
		});

		JavaPairRDD<Integer, String> delayedFlights_airline_airports_sorted = delayedFlights_airline_airport.sortByKey(false);

		delayedFlights_airline_airports_sorted.saveAsTextFile(outputPath1);

		// Task 2 - Overloaded routes
		JavaPairRDD<String,RouteFlightsDetails> routes_flight_details_1 = flights.mapToPair(line -> {
			String fields[] = line.split(",");
			String departure_airport_id = fields[5];
			String arrival_airport_id = fields[6];
			String cancelled = fields[8];
			Integer total_seats = Integer.parseInt(fields[9]);
			Integer booked_seats = Integer.parseInt(fields[10]);

			int booked;
			int cancelled_flight;
			int total = 1;
			if(total_seats.intValue()==booked_seats.intValue()){
				booked=1;
			}
			else{
				booked=0;
			}

			if(cancelled.compareTo("yes")==0){
				cancelled_flight=1;
			}
			else{
				cancelled_flight=0;
			}

			RouteFlightsDetails r = new RouteFlightsDetails(booked, cancelled_flight, total);
			return new Tuple2<String, RouteFlightsDetails>(departure_airport_id+","+arrival_airport_id, r);
		});

		JavaPairRDD<String, RouteFlightsDetails> routes_flights_details_aggregated = routes_flight_details_1.reduceByKey((r1, r2)->{
			RouteFlightsDetails r = new RouteFlightsDetails(r1.bookedFlights+r2.bookedFlights, r1.cancelledFlights+r2.cancelledFlights, r1.totalFlights+r2.totalFlights);
			return r;
		});

		JavaPairRDD<String, RouteFlightsDetails> routes_flights_fetails_filtered = routes_flights_details_aggregated.filter(route -> {
			double fully_booked = (double)route._2().bookedFlights/ (double)route._2().totalFlights;
			double cancelled = (double)route._2().cancelledFlights/(double)route._2().totalFlights;
			if(fully_booked>=0.99 && cancelled>=0.05){
				return true;
			}
			else{
				return false;
			}
		});

		routes_flights_fetails_filtered.keys().saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
