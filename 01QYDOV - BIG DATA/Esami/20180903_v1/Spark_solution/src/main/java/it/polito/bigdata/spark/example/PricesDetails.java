package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class PricesDetails implements Serializable{
    double minPrice;
    double maxPrice;

    public PricesDetails(double minPrice, double maxPrice){
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }
}
