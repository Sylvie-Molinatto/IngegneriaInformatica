package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class MinMaxPrice implements Serializable{
    double minPrice;
    double maxPrice;

    public MinMaxPrice(double minPrice, double maxPrice){
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }
}
