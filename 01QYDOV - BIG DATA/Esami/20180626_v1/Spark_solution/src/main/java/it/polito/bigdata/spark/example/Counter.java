package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class Counter implements Serializable{
    int cpuUsageGreater;
    int cpuUsageLess;

    public Counter(int cpuUsageGreater, int cpuUsageLess){
        this.cpuUsageGreater = cpuUsageGreater;
        this.cpuUsageLess = cpuUsageLess;
    }
    
}
