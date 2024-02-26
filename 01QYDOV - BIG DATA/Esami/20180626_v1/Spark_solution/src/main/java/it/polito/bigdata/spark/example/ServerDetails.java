package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class ServerDetails implements Serializable{
    double CPUUsage;
    double RAMUsage; 
    int count;

    public ServerDetails(double CPUUsage, double RAMUsage,int count){
        this.CPUUsage = CPUUsage;
        this.RAMUsage = RAMUsage;
        this.count = count;
    }

    public String toString(){
        return CPUUsage+","+RAMUsage+","+count;
    }
}
