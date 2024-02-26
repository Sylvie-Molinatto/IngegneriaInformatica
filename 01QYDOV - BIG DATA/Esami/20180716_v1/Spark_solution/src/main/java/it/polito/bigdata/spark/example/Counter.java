package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class Counter implements Serializable{
    int numFailures;
    int downTime;
    int numMonth;

    public Counter(int numFailures, int downTime, int numMonth){
        this.numFailures = numFailures;
        this.downTime = downTime;
        this.numMonth = numMonth;
    }

    public String toString(){
        return "NumFailures: "+numFailures+", downTime: "+downTime+", numMonth: "+numMonth;
    }
}
