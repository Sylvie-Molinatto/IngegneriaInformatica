package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class MovieWatchings implements Serializable{
    public String mid;
    public int numWatchings;

    public MovieWatchings(String mid, int numWatchings){
        this.mid = mid;
        this.numWatchings=numWatchings;
    }
}
