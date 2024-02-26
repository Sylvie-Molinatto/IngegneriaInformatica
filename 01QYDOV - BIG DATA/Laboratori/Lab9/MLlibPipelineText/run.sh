# Remove folders of the previous run
hdfs dfs -rm -r ex_data
hdfs dfs -rm -r ex_out

# Put input data collection into hdfs
hdfs dfs -put ex_data

# Run application
spark2-submit  --class it.polito.bigdata.spark.sparkmllib.SparkDriver --deploy-mode cluster --master yarn target/MLlibPipelineText-1.0.0.jar "ex_data/trainingData.txt"  "ex_data/unlabeledData.txt" ex_out


