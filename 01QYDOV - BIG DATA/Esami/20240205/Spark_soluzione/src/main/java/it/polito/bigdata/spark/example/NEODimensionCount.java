package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class NEODimensionCount implements Serializable{
    int NEOdimension;
    int NEOCount;

    public NEODimensionCount(int NEOdimension, int NEOCount){
        this.NEOdimension = NEOdimension;
        this.NEOCount = NEOCount;
    }

    public int getNEODimension(){
        return this.NEOdimension;
    }

    public int getNEOCount(){
        return this.NEOCount;
    }
    
}
