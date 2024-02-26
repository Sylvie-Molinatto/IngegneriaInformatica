package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class PowerConsumptionCountDC implements Serializable{

    int powerConsumption;
    int countDC;
    double avg;

    public PowerConsumptionCountDC(int powerConsumption, int countDC){
        this.powerConsumption = powerConsumption;
        this.countDC = countDC;
    }

}
