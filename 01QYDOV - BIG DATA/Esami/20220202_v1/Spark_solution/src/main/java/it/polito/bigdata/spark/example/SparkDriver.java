package it.polito.bigdata.spark.example;

import org.apache.spark.api.java.*;

import scala.Tuple2;

import org.apache.spark.SparkConf;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
	
public class SparkDriver {
	
	public static void main(String[] args) {

		// The following two lines are used to switch off some verbose log messages
		Logger.getLogger("org").setLevel(Level.OFF);
		Logger.getLogger("akka").setLevel(Level.OFF);

		String inputPathActions;
		String inputPathApps;
		String inputPathUsers;
		String outputPath1;
		String outputPath2;

		inputPathActions = args[0];
		inputPathApps = args[1];
		inputPathUsers = args[2];
		outputPath1 = args[3];
		outputPath2 = args[4];
	
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
		JavaRDD<String> actions = sc.textFile(inputPathActions).cache();

		JavaRDD<String> actions2021 = actions.filter(line->{
			String fields[] = line.split(",");
			String date = fields[2];
			String actionType = fields[3];
			if(date.startsWith("2021") && (actionType.equals("Install") || actionType.equals("Remove"))){
				return true;
			}
			else{
				return false;
			}
		});


		// Emit one pair (appId-month, (1,0)) if the action is Install and (appId-month, (0,1)) if the action is Remove
		JavaPairRDD<String, NumActions> appId_month_ones = actions2021.mapToPair(line->{
			String[] fields =  line.split(",");
			String appId = fields[1];
			String date = fields[2];
			String month = date.split("/")[1];
			String actionType = fields[3];

			if(actionType.equals("Install")){
				NumActions na = new NumActions(1, 0);
				return new Tuple2<String, NumActions>(appId+"-"+month, na);
			}
			else{
				NumActions na = new NumActions(0, 1);
				return new Tuple2<String, NumActions>(appId+"-"+month, na);
			}
		});

		// Calculate, for each app and each month, the numer of installations and removals
		JavaPairRDD<String, NumActions> appId_month_numActions = appId_month_ones.reduceByKey((na1, na2)->{
			NumActions na = new NumActions(na1.numInstallation+na2.numInstallation, na1.numRemoval+na2.numRemoval);
			return na;
		});

		// Filter only the apps that have more installation than removal in the month
		JavaPairRDD<String, NumActions> appId_month_numInstallationGreatherThanRemoval = appId_month_numActions.filter(pair->{
			int numInstallation = pair._2().numInstallation;
			int numRemoval = pair._2().numRemoval;

			if(numInstallation>numRemoval){
				return true;
			}
			else{
				return false;
			}
		});

		// Emit a new pair (app_id, 1) 
		JavaPairRDD<String,Integer> appId_ones = appId_month_numInstallationGreatherThanRemoval.mapToPair(pair->{
			String appId_month = pair._1();
			String appId = appId_month.split("-")[0];
			return new Tuple2<String, Integer>(appId, 1);
		});

		// Count the number of month in which an app has more installations that removals
		JavaPairRDD<String, Integer> appId_numInstallationGreatherThanRemoval = appId_ones.reduceByKey((num1, num2) -> num1+num2);

		// Filter the apps that have more monthly installations than removals for each month of 2021
		JavaPairRDD<String, Integer> appId_numInstallationGreatherThanRemoval_eachMonth = appId_numInstallationGreatherThanRemoval.filter(pair->pair._2()==12);

		// Retrieve the app info
		JavaRDD<String> apps = sc.textFile(inputPathApps);

		// Emit new pairs (appId, appName)
		JavaPairRDD<String, String> appId_appName = apps.mapToPair(line->{
			String[] fields = line.split(",");
			String appId = fields[0];
			String appName = fields[1];
			return new Tuple2<String, String>(appId, appName);
		});

		// Join appId_appName and appId_numInstallationsGreathenThanRemoval_eachMonth
		JavaPairRDD<String, Tuple2<String, Integer>> appId_appName_numMonth = appId_appName.join(appId_numInstallationGreatherThanRemoval_eachMonth);

		// map to a new pair with only appId and name
		JavaPairRDD<String, String> result = appId_appName_numMonth.mapToPair(pair->{
			String appId = pair._1();
			String appName = pair._2()._1();
			return new Tuple2<String, String>(appId, appName);
		});

		result.saveAsTextFile(outputPath1);

		// Task 2
		JavaRDD<String> installationsAfterDecember2021 = actions.filter(line->{
			String[] fields = line.split(",");
			String date = fields[2].substring(0,10);
			String actionType = fields[3];
			if(actionType.equals("Install") && date.compareTo("2021/12/31")>=0){
				return true;
			}
			else{
				return false;
			}
		});

		// Pair (appId, userId) that represents each installation of a distinct user 
		JavaPairRDD<String, String> appId_userId_afterDecember2021 = installationsAfterDecember2021.mapToPair(line->{
			String[] fields = line.split(",");
			String userId = fields[0];
			String appId = fields[1];
			return new Tuple2<String, String>(appId, userId);
		}).distinct();

		JavaRDD<String> installationsBeforeJanuary2022 = actions.filter(line->{
			String[] fields = line.split(",");
			String date = fields[2].substring(0,10);
			String actionType = fields[3];
			if(actionType.equals("Install") && date.compareTo("2021/12/31")<0){
				return true;
			}
			else{
				return false;
			}
		});

		JavaPairRDD<String, String> appId_userId_beforeJanuary2022 = installationsBeforeJanuary2022.mapToPair(line->{
			String[] fields = line.split(",");
			String userId = fields[0];
			String appId = fields[1];
			return new Tuple2<String, String>(appId, userId);
		}).distinct();

		JavaPairRDD<String,String> appId_users = appId_userId_afterDecember2021.subtract(appId_userId_beforeJanuary2022);

		JavaPairRDD<String, Integer> appId_userOnes = appId_users.mapToPair(pair-> new Tuple2<String, Integer>(pair._1(), 1));

		JavaPairRDD<String, Integer> appId_numDistinctNewUsers = appId_userOnes.reduceByKey((num1,num2)->num1+num2);

		int maxNumInstallations = appId_numDistinctNewUsers.values().reduce((num1,num2)->Math.max(num1,num2));

		JavaRDD<String> appsWithmaxNumDistinctNewUsers = appId_numDistinctNewUsers.filter(pair->{
			int numDistinctUsers = pair._2();
			if(numDistinctUsers==maxNumInstallations){
				return true;
			}
			else{
				return false;
			}
		}).keys();

		appsWithmaxNumDistinctNewUsers.saveAsTextFile(outputPath2);
		// Close the Spark context
		sc.close();
	}
}
