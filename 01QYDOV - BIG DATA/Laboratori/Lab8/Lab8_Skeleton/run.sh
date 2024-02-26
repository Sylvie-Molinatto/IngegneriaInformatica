# Remove output folder of the previous run
hdfs dfs -rm -r out_Lab8


# Run application
spark-submit  --class it.polito.bigdata.spark.example.SparkDriver --deploy-mode client --master local  target/Lab8_Template-1.0.0.jar /data/students/bigdata-01QYD/Lab7/register.csv /data/students/bigdata-01QYD/Lab7/stations.csv 0.6 out_Lab8
