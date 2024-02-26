# Remove folders of the previous run
rm -rf ex_outLab10

# Run application
spark-submit  --class it.polito.bigdata.spark.SparkDriver --deploy-mode client --master local[*] target/Lab10.jar input_data ex_outLab10


