package it.polito.bigdata.spark.example;

import java.io.Serializable;

@SuppressWarnings("serial")
public class StationDayHourFull implements Serializable{
    
    private int station;
    private String dayOfTheWeek;
    private int hour;
    private int full;


    public int getStation() {
        return station;
    }

    public String getDayOfTheWeek() {
        return dayOfTheWeek;
    }

    public int getHour() {
        return hour;
    }

    public int getFull() {
        return full;
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

    public void setFull(int full) {
        this.full = full;
    }

}