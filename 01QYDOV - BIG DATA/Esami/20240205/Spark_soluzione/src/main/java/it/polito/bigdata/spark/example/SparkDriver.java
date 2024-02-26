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

		String inputPathNEObject;
		String inputPathObservations;
		String inputPathObservatories;
		String outputPath1;
		String outputPath2;

		inputPathNEObject = args[0];
		inputPathObservations = args[1];
		inputPathObservatories = args[2];
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
		JavaRDD<String> NEObjects = sc.textFile(inputPathNEObject);

		JavaRDD<String> NEObjectsNotFallen = NEObjects.filter(line->{
			String fields[] = line.split(",");
			String alreadyFallen = fields[3];
			if(alreadyFallen.equals("False")){
			return true;
			}
			else{
			return false;
			}
		});

		NEODimensionCount neoDimensionCount = NEObjectsNotFallen.map(line->{
			String fields[] = line.split(",");
			int dimension = Integer.parseInt(fields[1]);
			NEODimensionCount ndc = new NEODimensionCount(dimension, 1);
			return ndc;
		}).reduce((ndc1,ndc2)->new NEODimensionCount(ndc1.getNEODimension()+ndc2.getNEODimension(), ndc1.getNEOCount()+ndc2.getNEOCount()));

		double avgDimension = (double) neoDimensionCount.getNEODimension() / (double) neoDimensionCount.getNEOCount();

		JavaPairRDD<String, String> mostRelevantNEOs = NEObjectsNotFallen.filter(line->{
			String fields[] = line.split(",");
			int dimension = Integer.parseInt(fields[1]);
			if(dimension>avgDimension){
				return true;
			}
			else{
				return false;
			}
		}).mapToPair(line -> new Tuple2<String, String>(line.split(",")[0], line.split(",")[0]));

		JavaRDD<String> observations2023 = sc.textFile(inputPathObservations).filter(line->{
			String[] fields = line.split(",");
			String date = fields[2];
			if(date.startsWith("2023")){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, Integer> neoID_numObservations = observations2023.mapToPair(line->{
			String fields[] = line.split(",");
			String neoID = fields[0];
			return new Tuple2<String, Integer>(neoID, 1);
		}).reduceByKey((num1,num2)->num1+num2);

		// (neoID, (numObservations, neoID))
		JavaPairRDD<String, Integer> mostRelevantNEO_numObservation = neoID_numObservations.join(mostRelevantNEOs).mapToPair(pair->{
			String neoID = pair._1();
			int numObservations = pair._2()._1();
			return new Tuple2<String, Integer>(neoID, numObservations);
		});

		JavaPairRDD<String, Integer> mostRelevantNEO_numObservation_sorted = mostRelevantNEO_numObservation
																			.mapToPair(pair->new Tuple2<Integer,String>(pair._2(),pair._1()))
																			.sortByKey(false).mapToPair(pair->new Tuple2<String, Integer>(pair._2(), pair._1()));

		mostRelevantNEO_numObservation_sorted.saveAsTextFile(outputPath1);

		// Task 2
		
		// Unique observations
		JavaPairRDD<String, String> neoid_observatoryId = observations2023.mapToPair(line->{
			String[] fields = line.split(",");
			String neoid = fields[0];
			String obsid = fields[1];
			return new Tuple2<String, String>(neoid, obsid);
		}).distinct();

		JavaPairRDD<String, String> uniqueObservationsNEOids = neoid_observatoryId.join(mostRelevantNEOs).mapToPair(pair->{
			String neo_id = pair._1();
			String obsId = pair._2()._1();
			return new Tuple2<>(neo_id, obsId);
		});

		JavaPairRDD<String, Integer> relavantNEOsObservedLessThan10Times = uniqueObservationsNEOids.mapToPair(pair->new Tuple2<String, Integer>(pair._1(), 1))
		                                                                                           .reduceByKey((num1, num2)->num1+num2)
																								   .filter(pair -> pair._2()<10);

	    // (neoId, (obs_id, numObs))
		JavaPairRDD<String, String> result = uniqueObservationsNEOids.join(relavantNEOsObservedLessThan10Times).mapToPair(pair->{
			String neoID = pair._1();
			String obsID = pair._2()._1();
			return new Tuple2<String, String>(neoID, obsID);
		});

		// all relevant neos - relevant neos with observation
		JavaPairRDD<String, String> relevantNeosNeverObserved = mostRelevantNEOs.map(pair->pair._1()).subtract(mostRelevantNEO_numObservation.keys())
		                                                                         .mapToPair(neoid -> new Tuple2<String, String>(neoid, "NONE"));

		result.union(relevantNeosNeverObserved).saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
