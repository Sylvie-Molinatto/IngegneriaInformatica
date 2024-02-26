package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class Requirements implements Serializable{
    int numFaultMonth;
    int numFaultWithLongDuration;
    int numMonths;

    public Requirements(int numFaulthMonth, int numFaultWithLongDuration, int numMonths){
        this.numFaultMonth = numFaulthMonth;
        this.numFaultWithLongDuration = numFaultWithLongDuration;
        this.numMonths = numMonths;
    }
}
