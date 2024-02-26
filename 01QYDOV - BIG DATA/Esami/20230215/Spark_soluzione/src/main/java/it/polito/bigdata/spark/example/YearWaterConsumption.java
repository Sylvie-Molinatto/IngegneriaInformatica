package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class YearWaterConsumption implements Serializable{
    
    private String year;
    private double waterConsumption;

    public YearWaterConsumption(String year, double waterConsumption){
        this.year = year;
        this.waterConsumption = waterConsumption;
    }

    public String getYear(){
        return this.year;
    }

    public double getWaterConsumption(){
        return this.waterConsumption;
    }
}
