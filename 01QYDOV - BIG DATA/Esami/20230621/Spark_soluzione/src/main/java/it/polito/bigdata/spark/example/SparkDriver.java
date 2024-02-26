package it.polito.bigdata.spark.example;

import org.apache.spark.api.java.*;
import org.apache.spark.SparkConf;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import scala.Tuple2;
	
public class SparkDriver {
	
	public static void main(String[] args) {

		// The following two lines are used to switch off some verbose log messages
		Logger.getLogger("org").setLevel(Level.OFF);
		Logger.getLogger("akka").setLevel(Level.OFF);

		String inputPathInvitations;
		String inputPathMeetings;
		String inputPathUsers;
		String outputPath1;
		String outputPath2;

		inputPathInvitations = args[0];
		inputPathMeetings = args[1];
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
		JavaRDD<String> users = sc.textFile(inputPathUsers);

		JavaPairRDD<String, String> businessUsers = users.filter(line->{
			String[] fields = line.split(",");
			String pricingPlan = fields[4];
			if(pricingPlan.equals("Business")){
				return true;
			}
			else{
				return false;
			}
		}).mapToPair(line -> {
			String[] fields = line.split(",");
			String uid = fields[0];
			String pricingPlan = fields[4];
			return new Tuple2<String, String>(uid, pricingPlan);
		});

		JavaRDD<String> meetings = sc.textFile(inputPathMeetings).cache();

		JavaPairRDD<String, Integer> uid_duration = meetings.mapToPair(line -> {
			String fields[] = line.split(",");
			String uid = fields[4];
			int duration = Integer.parseInt(fields[3]);
			return new Tuple2<String, Integer>(uid, duration);
		});

		JavaPairRDD<String, CounterMeetings> businessUsersMeetings = uid_duration.join(businessUsers).mapToPair(pair->{
			int duration = pair._2()._1();
			CounterMeetings cm = new CounterMeetings(duration, duration, duration, 1);
			return new Tuple2<String, CounterMeetings>(pair._1(), cm);
		});

		JavaPairRDD<String, CounterMeetings> uid_counterMeetings = businessUsersMeetings.reduceByKey((cm1, cm2) -> {
			int maxDuration;
			int minDuration;
			if(cm1.maxDuration>cm2.maxDuration){
				maxDuration = cm1.maxDuration;
			}
			else{
				maxDuration = cm2.maxDuration;
			}

			if(cm1.minDuration<cm2.minDuration){
				minDuration = cm1.minDuration;
			}
			else{
				minDuration = cm2.minDuration;
			}
			CounterMeetings cm = new CounterMeetings(maxDuration, minDuration, cm1.totalDuration+cm2.totalDuration, cm1.countMeetings+cm2.countMeetings);
			return cm;
		});

		uid_counterMeetings.saveAsTextFile(outputPath1);

		// Task 2
		JavaRDD<String> invitations = sc.textFile(inputPathInvitations);

		JavaPairRDD<String, Integer> meetingInvitations = invitations.mapToPair(line->{
			String fields[] = line.split(",");
			String mid = fields[0];
			return new Tuple2<String, Integer>(mid, 1);
		});

		JavaPairRDD<String, Integer> meetingInvitationsNumber = meetingInvitations.reduceByKey((num1,num2)->new Integer(num1+num2));

		JavaPairRDD<String, String> mid_UserId = meetings.mapToPair(line->{
			String[] fields = line.split(",");
			String mid = fields[0];
			String uid_creator = fields[4];
			return new Tuple2<String, String>(mid, uid_creator);
		});

		//(mid, (uid_creator, numInvited))
		JavaPairRDD<String, Tuple2<String, Integer>> mid_uid_numInvited = mid_UserId.join(meetingInvitationsNumber);

		JavaPairRDD<String, InvitationTypesCounter> uid_invTipesCounter = mid_uid_numInvited.mapToPair(pair -> {
			int numInvited = pair._2()._2();
			InvitationTypesCounter itc;
			if(numInvited<5){
				itc = new InvitationTypesCounter(0, 0, 1);
			}
			else if(numInvited>=5 && numInvited<=20){
				itc = new InvitationTypesCounter(0, 1, 0);
			}
			else{
				itc = new InvitationTypesCounter(1, 0, 0);
			}
			return new Tuple2<String, InvitationTypesCounter>(pair._2()._1(), itc);
		}).reduceByKey((itc1, itc2) -> new InvitationTypesCounter(itc1.largeMeetingsCount+itc2.largeMeetingsCount, itc1.mediumMeetingsCount+itc2.mediumMeetingsCount, itc1.smallMeetingsCount+itc2.smallMeetingsCount));

		JavaPairRDD<String, InvitationTypesCounter> uid_invTipesCounterBusinessUsers = uid_invTipesCounter.join(businessUsers).mapToPair(pair-> new Tuple2<String,InvitationTypesCounter>(pair._1(), pair._2()._1()));
		
		uid_invTipesCounterBusinessUsers.saveAsTextFile(outputPath2);

		// Close the Spark context
		sc.close();
	}
}
