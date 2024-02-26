package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class CounterConsumption implements Serializable{
    double powerConsumption;
    int count;

    public CounterConsumption(double powerConsumption, int count){
        this.powerConsumption = powerConsumption;
        this.count = count;
    }

    public double getPowerConsumption(){
        return this.powerConsumption;
    }

    public int getCount(){
        return this.count;
    }
}
