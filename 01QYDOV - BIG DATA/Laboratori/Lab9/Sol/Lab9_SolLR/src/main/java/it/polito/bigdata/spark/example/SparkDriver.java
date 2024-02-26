package it.polito.bigdata.spark.example;



import org.apache.spark.api.java.*;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.ml.Pipeline;
import org.apache.spark.ml.PipelineModel;
import org.apache.spark.ml.PipelineStage;
import org.apache.spark.ml.classification.LogisticRegression;
import org.apache.spark.ml.linalg.Vector;
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
		SparkSession ss = SparkSession.builder().appName("Spark Lab9 - LR").master("local").getOrCreate();

		// Create a Java Spark Context from the Spark Session
		// When a Spark Session has already been defined this method 
		// is used to create the Java Spark Context
		JavaSparkContext sc = new JavaSparkContext(ss.sparkContext());
		
		
        //EX 1: READ AND FILTER THE DATASET INTO A DATAFRAME
		
		JavaRDD<String> data=sc.textFile(inputPath);

		JavaRDD<String> labeledData = data.filter(new RemoveHeaderAndNonRated()); 
		
		// To avoid parsing the comma escaped within quotes, you can use the following regex:
		// line.split(",(?=([^\"]*\"[^\"]*\")*[^\"]*$)");
		// instead of the simpler
		// line.split(",");
		// this will ignore the commas followed by an odd number of quotes.

		// Map each element (each line of the input file) a LabelPoint
		JavaRDD<LabeledPoint> dataRDD=labeledData.map(line -> {
			String[] fields = line.split(",(?=([^\"]*\"[^\"]*\")*[^\"]*$)");
			//Id,ProductId,UserId,ProfileName,HelpfulnessNumerator,HelpfulnessDenominator,Score,Time,Summary,Text
			//0, 1,        2,     3,          4,                   5,                     6,    7,   8,      9
			double helpfulnessNum = Double.parseDouble(fields[4]);
			double helpfulnessDen = Double.parseDouble(fields[5]);
			double classLabel;
			
			// if (helpfulnessNum/helpfulnessDen)>0.9 the class label is "useful" otherwise it is "useless" 
			if ((helpfulnessNum/helpfulnessDen)>0.9) {
				classLabel = 1.0;
			} else {
				classLabel = 0.0;
			}

			// In this solution we decided to use
			// - The length of text
			// - The number of words in text
			// - The length of summary
			// - The number of words in summary
			// - The number of ! appearing in text
			// - The number of ! appearing in  summary
			// - The score assigned to the reviewed item in this review
			double[] attributesValues = new double[7];
		    
			attributesValues[0] = fields[9].length();
			attributesValues[1] = (fields[9].split("\\s+")).length;
			attributesValues[2] = fields[8].length();
			attributesValues[3] = (fields[8].split("\\s+")).length;
			attributesValues[4] = (fields[9].split("!")).length;
			attributesValues[5] = (fields[8].split("!")).length;
			attributesValues[6] = (Double.parseDouble(fields[6]));
			
			// Create a dense vector based in the content of attributesValues
			Vector attrValues= Vectors.dense(attributesValues);

			// Return a new LabeledPoint
			return new LabeledPoint(classLabel, attrValues);
		});
		
		// We use LabeledPoint, which is a JavaBean.  
		// We use Spark SQL to convert RDDs of JavaBeans
		// into DataFrames.
		// Each data point has a set of features and a label
		Dataset<Row> schemaReviews = ss.createDataFrame(dataRDD, LabeledPoint.class).cache();

		// Select example rows to display.
        schemaReviews.show(5);

        
        // Split the data into training and test sets (30% held out for testing)
        Dataset<Row>[] splits = schemaReviews.randomSplit(new double[]{0.7, 0.3});
        Dataset<Row> trainingData = splits[0];
        Dataset<Row> testData = splits[1];

        //EX 2: CREATE THE PIPELINE THAT IS USED TO BUILD THE CLASSIFICATION MODEL
		
		// Create a Logistic regression model
        // We use the default parameters for the algorithm
		LogisticRegression lr= new LogisticRegression();
		
		
		// Define the pipeline that is used to create the logistic regression
		// model on the training data
		// In this case the pipeline contains one single stage/step (the model
		// generation step).
		Pipeline pipeline = new Pipeline()
				  .setStages(new PipelineStage[] {lr});
				
				
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
