package it.polito.bigdata.spark.example;

import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.Column;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Encoders;
import org.apache.spark.sql.RelationalGroupedDataset;
import org.apache.spark.sql.Row;
import static org.apache.spark.sql.functions.*;

import org.apache.spark.SparkContext;

public class SparkDriver {

	public static void main(String[] args) {

		String inputPath;
		String inputPath2;
		Double threshold;
		String outputFolder;

		inputPath = args[0];
		inputPath2 = args[1];
		threshold = Double.parseDouble(args[2]);
		outputFolder = args[3];

		// Create a Spark Session object and set the name of the application
		// SparkSession ss = SparkSession.builder().appName("Spark Lab #8 - Template").getOrCreate();
		
		// Invoke .master("local") to execute tha application locally inside Eclipse
		SparkSession ss = SparkSession.builder().appName("Spark Lab #8 - Template").getOrCreate();
		
		SparkContext sc = ss.sparkContext();

		// print the application ID
		System.out.println("******************************");
		System.out.println("ApplicationId: " + sc.applicationId());
		System.out.println("******************************");

		// Read the content of the input file and store it in a Dataframe
		Dataset<Row> inputDf = ss.read().format("csv")
                .option("timestampFormat", "yyyy-MM-dd HH:mm:ss")
		        .option("delimiter", "\\t")
				.option("header", true)
				.option("inferSchema", true)
				.load(inputPath);
		
		
		Dataset<Reading> ds = inputDf.as(Encoders.bean(Reading.class));
		
		
		// Remove the readings with used_slots = 0 and free_slots = 0.
		Dataset<Reading> dsFiltered = ds.filter( record -> (record.getUsed_slots() != 0 || record.getFree_slots() != 0));

		// Create a Dataset<StationDayHourFull> starting from dsFiltered.
		Dataset<StationDayHourFull> dsStationDayHourFull = dsFiltered.map( record -> {

			
			StationDayHourFull new_record = new StationDayHourFull();
		    new_record.setStation(record.getStation());
			new_record.setDayOfTheWeek(DateTool.DayOfTheWeek(record.getTimestamp()));
		    new_record.setHour(DateTool.hour(record.getTimestamp()));
			if (record.getFree_slots() == 0)
				new_record.setFull(1);
			else
				new_record.setFull(0);


			return new_record;

		}, Encoders.bean(StationDayHourFull.class));

		// Group by station_id, dayOfTheWeek, our and calculate the avg to obtain the criticiality
		RelationalGroupedDataset rgd = dsStationDayHourFull.groupBy("station", "dayOfTheWeek", "hour");

		Dataset<StationDayHourCriticality> dsStationDayHourCriticality = rgd
		        .agg(avg("full")).withColumnRenamed("avg(full)", "criticality")
				.as(Encoders.bean(StationDayHourCriticality.class));

		Dataset<StationDayHourCriticality> dsStationDayHourCriticalityFiltered = dsStationDayHourCriticality.filter( record -> record.getCriticality() > threshold);

		
		Dataset<Row> dfStations = ss.read().format("csv")
		        .option("delimiter", "\\t")
				.option("header", true) 
				.option("inferSchema", true).load(inputPath2);

		Dataset<Station> dsStations = dfStations.as(Encoders.bean(Station.class));
		

		// join the content of StationDayHourCriticality with stations
		Dataset<FinalRecord> finalDs = dsStationDayHourCriticalityFiltered.join(dsStations, dsStationDayHourCriticalityFiltered.col("station").equalTo(dsStations.col("id")))
		        .selectExpr("station", "dayOfTheWeek", "hour", "longitude", "latitude", "criticality")
				.sort(new Column("criticality").desc(), new Column("station"), new Column("dayOfTheWeek"),
						new Column("hour"))
				.as(Encoders.bean(FinalRecord.class));

	
		finalDs.show();

		// Store the result in the output folder
		finalDs.write().format("csv").option("header", true).save(outputFolder);
		// Close the Spark session
		ss.stop();
	}
}
