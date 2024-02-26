hdfs dfs -rm -r ex_outLab10ex2
  
spark-submit  --class it.polito.bigdata.spark.SparkDriver --deploy-mode client --master local[*] target/SolLab10Ex2-1.0.0.jar input_HDFS_folder ex_outLab10ex2

