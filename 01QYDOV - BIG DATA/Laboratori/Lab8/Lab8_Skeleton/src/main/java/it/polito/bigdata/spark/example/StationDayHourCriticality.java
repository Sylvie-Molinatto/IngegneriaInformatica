package it.polito.bigdata.spark.example;

import java.io.Serializable;

@SuppressWarnings("serial")
public class StationDayHourCriticality implements Serializable{

    private int station;
    private String dayOfTheWeek;
    private int hour;
    private double criticality;

    
    public int getStation() {
        return station;
    }

    public String getDayOfTheWeek() {
        return dayOfTheWeek;
    }

    public int getHour() {
        return hour;
    }

    public double getCriticality() {
        return criticality;
    }

    public void setStation(int station) {
        this.station = station;
    }

    public void setDayOfTheWeek(String dayOfTheWeek) {
        this.dayOfTheWeek = dayOfTheWeek;
    }

    public void setHour(int hour) {
        this.hour = hour;
    }

    public void setCriticality(double criticality) {
        this.criticality = criticality;
    }
    
}
