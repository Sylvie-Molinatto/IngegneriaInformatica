package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class Requirements implements Serializable{
    int lessThan1;
    int greaterThan40;

    public Requirements(int lessThan1, int greaterThan40){
        this.lessThan1 = lessThan1;
        this.greaterThan40 = greaterThan40;
    }
}
