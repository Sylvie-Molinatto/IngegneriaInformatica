package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class NumPatchesApplication implements Serializable{
    int numPatches;
    String application;

    public NumPatchesApplication(int numPatches, String application){
        this.numPatches = numPatches;
        this.application = application;
    }

    public String toString(){
        return new String(application.substring(0,1));
    }
}
