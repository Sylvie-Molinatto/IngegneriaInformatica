package it.polito.bigdata.spark.example;

import org.apache.spark.api.java.*;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.ml.Pipeline;
import org.apache.spark.ml.PipelineModel;
import org.apache.spark.ml.PipelineStage;
import org.apache.spark.ml.classification.LogisticRegression;
import org.apache.spark.ml.linalg.Vectors;
import org.apache.spark.mllib.evaluation.MulticlassMetrics;
import org.apache.spark.mllib.linalg.Matrix;
import org.apache.spark.ml.feature.LabeledPoint;

public class SparkDriver {

	@SuppressWarnings("resource")
	public static void main(String[] args) {

		String inputPath;

		inputPath=args[0];
	
		
		// Create a Spark Session object and set the name of the application
		// We use some Spark SQL transformation in this program
		SparkSession ss = SparkSession.builder().appName("Spark Lab9").master("local").getOrCreate();

		// Create a Java Spark Context from the Spark Session
		// When a Spark Session has already been defined this method 
		// is used to create the Java Spark Context
		JavaSparkContext sc = new JavaSparkContext(ss.sparkContext());

		// print the application ID
		System.out.println("******************************");
		System.out.println("ApplicationId: "+JavaSparkContext.toSparkContext(sc).applicationId());
		System.out.println("******************************");
		
    	//EX 1: READ AND FILTER THE DATASET AND STORE IT INTO A DATAFRAME
		
		// Read data
		JavaRDD<String> data=sc.textFile(inputPath);
		
		// To avoid parsing the comma escaped within quotes, you can use the following regex:
		// line.split(",(?=([^\"]*\"[^\"]*\")*[^\"]*$)");
		// instead of the simpler
		// line.split(",");
		// this will ignore the commas followed by an odd number of quotes.

		// Remove header and reviews with HelpfulnessDenominator equal to 0
		JavaRDD<String> labeledData = data.filter(
			line -> {
				String[] fields = line.split(",(?=([^\"]*\"[^\"]*\")*[^\"]*$)");
				if (fields[0].equals("Id") || Integer.parseInt(fields[5]) == 0) {
					return false;
				} else {
					return true;
				}
			}
		); 

		// Map each element (each line of the input file) to a LabelPoint
		// Decide which numerical attributes you want to insert into features (data type: Vector) 
		JavaRDD<LabeledPoint> dataRDD=labeledData.map(
			line -> {
				String[] fields = line.split(",(?=([^\"]*\"[^\"]*\")*[^\"]*$)");
				double helpfulnessNum = Double.parseDouble(fields[4]);
				double helpfunessDen = Double.parseDouble(fields[5]);
				double classLabel;

				if(helpfulnessNum/helpfunessDen > 0.9) {
					classLabel = 1.0;
				} else {
					classLabel = 0.0;
				}

				double[] features = new double[1];
				features[0] = fields[9].length();
				
				return new LabeledPoint(classLabel, Vectors.dense(features));
			}
		); 
		
		// Define a Dataframe, with columns label and features, from dataRDD 
		Dataset<Row> schemaReviews = ss.createDataFrame(dataRDD, LabeledPoint.class).cache();
					
		// Debug 
		// Display 5 example rows.
    	schemaReviews.show(5);
		
        
        // The following part of the code splits the data into training 
		// and test sets (30% held out for testing)
        Dataset<Row>[] splits = schemaReviews.randomSplit(new double[]{0.7, 0.3});
        Dataset<Row> trainingData = splits[0];
        Dataset<Row> testData = splits[1];

    	//EX 2: CREATE THE PIPELINE THAT IS USED TO BUILD THE CLASSIFICATION MODEL
        Pipeline pipeline = new Pipeline()
			.setStages(new PipelineStage[] {new LogisticRegression()});
			

        // Train model. Use the training set 
        PipelineModel model = pipeline.fit(trainingData);
		

		/*==== EVALUATION ====*/
		
		// Make predictions for the test set.
		Dataset<Row> predictions = model.transform(testData);

		// Select example rows to display.
		predictions.show(5);

		// Retrieve the quality metrics. 
        MulticlassMetrics metrics = new MulticlassMetrics(predictions.select("prediction", "label"));

        // Confusion matrix
        Matrix confusion = metrics.confusionMatrix();
        System.out.println("Confusion matrix: \n" + confusion);

        double accuracy = metrics.accuracy();
		System.out.println("Accuracy = " + accuracy);
            
        // Close the Spark context
		sc.close();
	}
}
