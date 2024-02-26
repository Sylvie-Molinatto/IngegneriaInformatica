package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class CitySumCountMaxTemp implements Serializable{
    
    String city;
    Double sumTemp;
    Integer count;

    public CitySumCountMaxTemp(String city, Double sumTemp, Integer count){
        this.city = city;
        this.sumTemp = sumTemp;
        this.count = count;
    }

    public String toString(){
        return "City = "+city+" , sumTemp = "+sumTemp+" , count = "+count;
    }
    
}
