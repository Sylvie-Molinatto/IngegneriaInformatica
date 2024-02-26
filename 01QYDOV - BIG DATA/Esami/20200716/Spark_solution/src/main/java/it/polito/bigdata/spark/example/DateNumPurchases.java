package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class DateNumPurchases implements Serializable{
    String date;
    int numPurchases;

    public DateNumPurchases(String date, int numPurchases){
        this.date = date;
        this.numPurchases = numPurchases;
    }
}
