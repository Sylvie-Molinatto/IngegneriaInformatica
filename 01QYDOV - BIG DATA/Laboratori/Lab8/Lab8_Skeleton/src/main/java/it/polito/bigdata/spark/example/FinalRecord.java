package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class FinalRecord implements Serializable{

    private int station;
    private String dayOfTheWeek;
    private int hour;
    private double criticality;
    private double latitude;
    private double longitude;

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

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
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

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

}
