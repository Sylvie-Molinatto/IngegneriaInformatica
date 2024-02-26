package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class CityCountry implements Serializable{
    String city;
    String country;  

    public CityCountry(String city, String country){
        this.city = city;
        this.country = country;
    }

    public String getCity(){
        return this.city;
    }

    public String getCountry(){
        return this.country;
    }
}
