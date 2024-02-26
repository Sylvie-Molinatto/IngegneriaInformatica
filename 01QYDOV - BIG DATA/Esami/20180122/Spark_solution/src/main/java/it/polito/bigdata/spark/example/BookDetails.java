package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class BookDetails implements Serializable{
    double maxPrice;
    double minPrice;

    public BookDetails(double maxPrice, double minPrice){
        this.maxPrice = maxPrice;
        this.minPrice = minPrice;
    }

    public String toString(){
        return maxPrice+","+minPrice;
    }
    
}
