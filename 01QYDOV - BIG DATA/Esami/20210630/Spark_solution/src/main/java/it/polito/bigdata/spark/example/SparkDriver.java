package it.polito.bigdata.spark.example;

import org.apache.spark.api.java.*;
import org.apache.spark.SparkConf;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import scala.Tuple2;
	
public class SparkDriver {
	
	public static void main(String[] args) {

		// The following two lines are used to switch off some verbose log messages
		Logger.getLogger("org").setLevel(Level.OFF);
		Logger.getLogger("akka").setLevel(Level.OFF);

		String inputPathSales;
		String inputPathMotorBikes;
		String outputPath1;
		String outputPath2;

		inputPathSales = args[0];
		inputPathMotorBikes = args[1];
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
		JavaRDD<String> sales = sc.textFile(inputPathSales).cache();

		JavaRDD<String> motorbikes = sc.textFile(inputPathMotorBikes);

		JavaRDD<String> salesFiltered = sales.filter(line->{
			String[] fields = line.split(",");
			String date = fields[3];
			String EU = fields[6];
			if(date.startsWith("2020") && EU.compareTo("T")==0){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, PriceMinMax> modelId_price = salesFiltered.mapToPair(line ->{
			String fields[] = line.split(",");
			String modelId = fields[2];
			Double price = Double.parseDouble(fields[5]);
			PriceMinMax pmm = new PriceMinMax(price, price);
			return new Tuple2<String, PriceMinMax>(modelId, pmm);
		});

		JavaPairRDD<String, PriceMinMax> modelId_PriceMinMax = modelId_price.reduceByKey((pmm1, pmm2)->{
			double minPrice = Math.min(pmm1.minPrice, pmm2.minPrice);
			double maxPrice = Math.max(pmm1.maxPrice, pmm2.maxPrice);
			PriceMinMax pmm = new PriceMinMax(minPrice, maxPrice);
			return pmm;
		});

		JavaPairRDD<String, PriceMinMax> modelId_greatVariation = modelId_PriceMinMax.filter(pair->{
			if(pair._2().maxPrice-pair._2().minPrice>=5000){
				return true;
			}
			else{
				return false;
			}
		});

		modelId_greatVariation.keys().saveAsTextFile(outputPath1);

		// Task 2

		 // count for each motorbike models the number of sales
		 JavaPairRDD<String, Integer> countSalesRDD = sales.mapToPair(line -> {
            String[] fields = line.split(",");
            String modelID = fields[2];
            return new Tuple2<>(modelID, 1);
        }).reduceByKey((i1, i2) -> i1 + i2);
        
        // Select the motorbike models with more than 10 sales. 
        // They are neither unsold nor infrequently sold models.  
        JavaPairRDD<String, Integer> countSalesMoreThan10RDD =  countSalesRDD.filter(pair -> pair._2()>10);  

        // Map the motorbikes txt file into a pairRDD
        // containing (modelID, manufacturer)
        JavaPairRDD<String, String> modelManufacturerRDD = motorbikes.mapToPair(line -> {
            String[] fields = line.split(",");
            String modelID = fields[0];
            String manufacturer = fields[2];

            return new Tuple2<>(modelID, manufacturer);
        });

        
        // Select from modelManufacturerRDD the motorbike models that are unsold or   
        // infrequently sold models
        JavaPairRDD<String, String> unsoldInfreqModelsManufRDD = modelManufacturerRDD
        		.subtractByKey(countSalesMoreThan10RDD);
        
        
        
        // Map the previously computed RDD (modelID, manufacturer)
        // into (Manufacturer, +1)
        // and count the number of infrequent + unsold motorbike models for each manufacturer
        // The result is (manufacturer, countUnsoldInfrequentMotorbikes)
        JavaPairRDD<String, Integer> manufacturerUnsoldInfreqCountRDD = unsoldInfreqModelsManufRDD
                                                                            .mapToPair(it -> new Tuple2<>(it._2(), 1))
                                                                            .reduceByKey((i1, i2) -> i1 + i2);

        // Filter only manufacturers with unsold + infrequent motorbike models >= 15
        JavaPairRDD<String, Integer> filteredManufacturersRDD = manufacturerUnsoldInfreqCountRDD
                                                                        .filter(it -> it._2() >= 3); //15, set 3 for testing

        filteredManufacturersRDD.saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
