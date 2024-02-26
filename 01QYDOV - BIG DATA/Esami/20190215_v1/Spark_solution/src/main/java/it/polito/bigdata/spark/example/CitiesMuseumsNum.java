package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class CitiesMuseumsNum implements Serializable{
    int numMuseums;
    int numCities;

    public CitiesMuseumsNum(int numMuseums, int numCities){
        this.numMuseums = numMuseums;
        this.numCities = numCities;
    }
}
