package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class SumCountMaxTemp implements Serializable{
    
    public double sumTemp;
    public int count;

    public SumCountMaxTemp(double sumTemp, int count){
        this.sumTemp = sumTemp;
        this.count = count;
    }

    public String toString(){
        return "sumTemp = "+sumTemp+" ,count= "+count;
    }
}
