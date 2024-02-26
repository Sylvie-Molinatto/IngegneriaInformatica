package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class Counter implements Serializable{
    int requirementRespected;
    int countDC;

    public Counter(int requirementRespected, int countDC){
        this.requirementRespected = requirementRespected;
        this.countDC = countDC;
    }
}
