# Remove folders of the previous run
rm -rf ex_out


# Run application
spark-submit  --class it.polito.bigdata.spark.sparkmllib.SparkDriver --deploy-mode client --master local target/MLlibPipelineText-1.0.0.jar "ex_data/trainingData.txt"  "ex_data/unlabeledData.txt" ex_out


