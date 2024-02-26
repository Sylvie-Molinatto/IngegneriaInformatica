package it.polito.bigdata.spark.example;



import org.apache.spark.api.java.*;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.ml.Pipeline;
import org.apache.spark.ml.PipelineModel;
import org.apache.spark.ml.PipelineStage;
import org.apache.spark.ml.classification.DecisionTreeClassifier;
import org.apache.spark.ml.feature.HashingTF;
import org.apache.spark.ml.feature.IDF;
import org.apache.spark.ml.feature.StopWordsRemover;
import org.apache.spark.ml.feature.Tokenizer;
import org.apache.spark.mllib.evaluation.MulticlassMetrics;
import org.apache.spark.mllib.linalg.Matrix;

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

		// Map each element (each line of the input file) to a LabeledDocument
		// LabeledDocument is a class defined in this application. Each instance 
		// of LabeledDocument is characterized by two attributes:
		// 	- private double label
		//  - private String text
		// Each instance of LabeledDocument is a "document" and the related class label.
		JavaRDD<LabeledDocument> trainingRDD=labeledData.map(line -> {
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
			
			// Retrieve the text of the reviews
			String text = fields[9];

			// Return a new LabeledDocument
			return new LabeledDocument(classLabel, text);
		});
		

		// Prepare training data.
		// We use LabeledDocument, which is a JavaBean.  
		// We use Spark SQL to convert RDDs of JavaBeans
		// into Dataset<Row>. The columns of the Dataset are label
		// and features
		Dataset<Row> schemaReviews = ss.createDataFrame(trainingRDD, LabeledDocument.class).cache();

		// Select example rows to display.
        schemaReviews.show(5);

        
        // Split the data into training and test sets (30% held out for testing)
        Dataset<Row>[] splits = schemaReviews.randomSplit(new double[]{0.7, 0.3});
        Dataset<Row> trainingData = splits[0];
        Dataset<Row> testData = splits[1];

        //EX 2: CREATE THE PIPELINE THAT IS USED TO BUILD THE CLASSIFICATION MODEL
		
		// Configure an ML pipeline, which consists of five stages: 
		// tokenizer -> split sentences in set of words
		// remover -> remove stopwords
		// hashingTF -> map set of words to a fixed-length feature vectors 
		//				(each word becomes a feature and the value of the feature 
		//				 is the frequency of the word in the sentence)
		// idf -> compute the idf component of the TF-IDF measure
		// dt -> decision tree classification algorithm

		// The Tokenizer splits each sentence in a set of words.
		// It analyzes the content of column "text" and adds the 
		// new column "words" in the returned DataFrame
		Tokenizer tokenizer = new Tokenizer()
		  .setInputCol("text")
		  .setOutputCol("words");
		
		// Remove stopwords.
		// the StopWordsRemover component returns a new DataFrame with 
		// new column called "filteredWords". "filteredWords" is generated 
		// by removing the stopwords from the content of column "words" 
		StopWordsRemover remover = new StopWordsRemover()
		  .setInputCol("words")
		  .setOutputCol("filteredWords");
		
		// Map words to a features
		// Each word in filteredWords must become a feature in a Vector object
		// The HashingTF Transformer performs this operation.
		// This operations is based on a hash function and can potentially 
		// map two different word to the same "feature". The number of conflicts
		// in influenced by the value of the numFeatures parameter.  
		// The "feature" version of the words is stored in Column "rawFeatures". 
		// Each feature, for a document, contains the number of occurrences 
		// of that feature in the document (TF component of the TF-IDF measure) 
		HashingTF hashingTF = new HashingTF()
		  .setNumFeatures(1000)
		  .setInputCol("filteredWords")
		  .setOutputCol("rawFeatures");

		// Apply the IDF transformation.
		// Update the weight associated with each feature by considering also the 
		// inverse document frequency component. The returned new column is called
		// "features", that is the standard name for the column that contains the 
		// predictive features used to create a classification model 
		IDF idf = new IDF()
				.setInputCol("rawFeatures")
				.setOutputCol("features");

		// Create a decision tree model
        // We use the default parameters for the algorithm
		DecisionTreeClassifier dt= new DecisionTreeClassifier();
		
		
		// Define the pipeline that is used to create the decision tree
		// model on the training data.
		// In this case the pipeline is composed of five steps
		// - text tokenizer
		// - stopword removal
		// - TF-IDF computation (performed in two steps)
		// - Decision tree model generation
		Pipeline pipeline = new Pipeline()
		  .setStages(new PipelineStage[] {tokenizer, remover, hashingTF, idf, dt});
				
				
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
