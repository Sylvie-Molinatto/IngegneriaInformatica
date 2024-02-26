package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class FirstDatePriceLastDatePrice implements Serializable{
    
    public String firstDate;
    public Double firstPrice;
    public String lastDate;
    public Double lastPrice;

    public FirstDatePriceLastDatePrice(String firstDate, Double firstPrice, String lastDate, Double lastPrice){
        this.firstDate = firstDate;
        this.firstPrice = firstPrice;
        this.lastDate = lastDate;
        this.lastPrice = lastPrice;
    }

    public String toString(){
        return firstDate+" "+firstPrice+"-"+lastDate+" "+lastPrice;
    }
}
