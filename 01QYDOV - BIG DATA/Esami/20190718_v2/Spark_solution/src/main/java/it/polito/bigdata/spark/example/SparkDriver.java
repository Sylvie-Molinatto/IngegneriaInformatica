package it.polito.bigdata.spark.example;

import org.apache.spark.api.java.*;
import org.apache.spark.SparkConf;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import scala.Tuple2;
	
public class SparkDriver {
	
	public static void main(String[] args) {

		// The following two lines are used to switch off some verbose log messages
		Logger.getLogger("org").setLevel(Level.OFF);
		Logger.getLogger("akka").setLevel(Level.OFF);

		String inputPath;
		String outputPath1;
		String outputPath2;

		inputPath = args[0];
		outputPath1 = args[1];
		outputPath2 = args[2];
	
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
		JavaRDD<String> commits = sc.textFile(inputPath).cache();

		JavaRDD<String> commitsFiltered = commits.filter(line->{
			String[] fields = line.split(",");
			String date = fields[1];
			String project = fields[2];
			if(date.startsWith("2019/06") && (project.compareTo("Apache Flink")==0 || project.compareTo("Apache Spark")==0)){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, Integer> project_month_ones = commitsFiltered.mapToPair(line->{
			String[] fields = line.split(",");
			String date = fields[1].substring(0,10);
			String project = fields[2];
			return new Tuple2<String, Integer>(project+"-"+date,1);
		});

		JavaPairRDD<String, Integer> project_month_sumCommits = project_month_ones.reduceByKey((num1,num2) -> num1+num2);

		JavaPairRDD<String, ProjectNumCommits> month_project_numCommits = project_month_sumCommits.mapToPair(pair->{
			String project = pair._1().split("-")[0];
			String date = pair._1().split("-")[1];
			int numCommits = pair._2();
			ProjectNumCommits pnc = new ProjectNumCommits(project, numCommits);
			return new Tuple2<String, ProjectNumCommits>(date, pnc);
		});

		JavaPairRDD<String, ProjectNumCommits> month_project_MaxNumCommits = month_project_numCommits.reduceByKey((pnc1,pnc2)->{
			
			if(pnc1.numCommits>pnc2.numCommits){
				return new ProjectNumCommits(pnc1.project, pnc1.numCommits);
			}
			else if (pnc2.numCommits > pnc1.numCommits){
				return new ProjectNumCommits(pnc2.project, pnc2.numCommits);
			}
			else{
				return null;
			}
		});

		JavaPairRDD<String, ProjectNumCommits> month_project_MaxNumCommits_filtered = month_project_MaxNumCommits.filter(pair->pair._2()!=null);

		month_project_MaxNumCommits_filtered.saveAsTextFile(outputPath1);

		// Task 2
		JavaRDD<String> commits2017 = commits.filter(line->{
			String fields[] = line.split(",");
			String date = fields[1];
			if(date.startsWith("2017")){
				return true;
			}
			else{
				return false;
			}
		});

		// Count for each project and month the number of commits
		JavaPairRDD<MonthProject, Integer> monthProject_ones = commits2017.mapToPair(line->{
			String[] fields = line.split(",");
			String date = fields[1];
			int month = Integer.parseInt(date.split("/")[1]);
			String project = fields[2];
			MonthProject mp = new MonthProject(month, project);
			return new Tuple2<MonthProject, Integer>(mp,1);
		});

		JavaPairRDD<MonthProject, Integer> monthProject_numCommits = monthProject_ones.reduceByKey((num1,num2)->new Integer(num1+num2));

		JavaPairRDD<MonthProject, Integer> monthProject_numCommits_filtered = monthProject_numCommits.filter(pair->pair._2()>=20);

		JavaPairRDD<MonthProject, Integer> projectWindow_ones = monthProject_numCommits_filtered.flatMapToPair(pair ->{
			int month = pair._1().getMonth();
			String project = pair._1().getProject();
			
			List<Tuple2<MonthProject, Integer>> results = new ArrayList<Tuple2<MonthProject, Integer>>();

			results.add(new Tuple2<MonthProject, Integer>(new MonthProject(month, project), 1));

			if(month-1>0){
				results.add(new Tuple2<MonthProject,Integer>(new MonthProject(month-1, project), 1));
			}

			if(month-2>0){
				results.add(new Tuple2<MonthProject,Integer>(new MonthProject(month-2, project), 1));
			}

			return results.iterator();
		});

		JavaPairRDD<MonthProject, Integer> projectWindow_count = projectWindow_ones.reduceByKey((num1,num2) -> new Integer(num1+num2));

		JavaPairRDD<MonthProject, Integer> projectWindow_filtered = projectWindow_count.filter(pair->pair._2()==3);

		projectWindow_filtered.keys().saveAsTextFile(outputPath2);

		JavaRDD<String> selectedProject = projectWindow_filtered.map(pair->pair._1().getProject()).distinct();

		System.out.println("Numer of selected projets: "+selectedProject.count());
		
		// Close the Spark context
		sc.close();
	}
}
