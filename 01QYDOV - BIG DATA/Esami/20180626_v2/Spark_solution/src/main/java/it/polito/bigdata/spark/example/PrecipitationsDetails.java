package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class PrecipitationsDetails implements Serializable{
    double precipitation_mm;
    double wind_speed;
    int count;

    public PrecipitationsDetails(double precipitation_mm, double wind_speed, int count){
        this.precipitation_mm = precipitation_mm;
        this.wind_speed = wind_speed;
        this.count = count;
    }
    
}
