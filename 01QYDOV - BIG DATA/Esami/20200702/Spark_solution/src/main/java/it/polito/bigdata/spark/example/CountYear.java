package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class CountYear implements Serializable{
    int count;
    int year;

    public CountYear(int count, int year){
        this.count = count;
        this.year = year;
    }

    public String toString(){
        return ""+count;
    }
}
