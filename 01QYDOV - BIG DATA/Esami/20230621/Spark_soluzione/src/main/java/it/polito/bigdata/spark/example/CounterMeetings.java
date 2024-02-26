package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class CounterMeetings implements Serializable{

    int maxDuration;
    int minDuration;
    int totalDuration;
    int countMeetings;

    public CounterMeetings(int maxDuration, int minDuration, int totalDuration, int countMeetings){
        this.maxDuration = maxDuration;
        this.minDuration = minDuration;
        this.totalDuration = totalDuration;
        this.countMeetings = countMeetings;
    }

    public String toString(){
        double avgDuration = (double) totalDuration / (double) countMeetings;
        return ""+avgDuration+","+minDuration+","+maxDuration;
    }
    
}
