package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class NumActions implements Serializable{
    public int numInstallation;
    public int numRemoval;

    public NumActions(int numInstallation, int numRemoval){
        this.numInstallation = numInstallation;
        this.numRemoval = numRemoval;
    }
}
