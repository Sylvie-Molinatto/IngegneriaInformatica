package it.polito.bigdata.spark.example;

@SuppressWarnings("serial")
public class Station implements java.io.Serializable{
    
    private int id;
    private double longitude;
    private double latitude;
    private String name;

    public int getId() {
        return id;
    }

    public double getLongitude() {
        return longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public String getName() {
        return name;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public void setName(String name) {
        this.name = name;
    }

}
