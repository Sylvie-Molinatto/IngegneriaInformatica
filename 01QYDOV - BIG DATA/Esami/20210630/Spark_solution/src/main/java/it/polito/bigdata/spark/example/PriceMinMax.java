package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class PriceMinMax implements Serializable{
    double minPrice;
    double maxPrice;

    public PriceMinMax(double minPrice, double maxPrice){
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }
}
