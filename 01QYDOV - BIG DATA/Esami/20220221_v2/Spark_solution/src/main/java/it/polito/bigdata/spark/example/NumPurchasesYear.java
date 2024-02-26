package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class NumPurchasesYear implements Serializable{
    int numPurchases2020;
    int numPurchases2021;

    public NumPurchasesYear(int numPurchases2020, int numPurchases2021){
        this.numPurchases2020 = numPurchases2020;
        this.numPurchases2021 = numPurchases2021;
    }
}
