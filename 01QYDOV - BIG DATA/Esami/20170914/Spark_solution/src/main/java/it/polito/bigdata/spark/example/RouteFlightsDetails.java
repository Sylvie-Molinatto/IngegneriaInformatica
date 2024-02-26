package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class RouteFlightsDetails implements Serializable{
    public int bookedFlights;
    public int cancelledFlights;
    public int totalFlights;

    public RouteFlightsDetails(int bookedFlights, int cancelledFlights, int totalFlights){
        this.bookedFlights = bookedFlights;
        this.cancelledFlights = cancelledFlights;
        this.totalFlights = totalFlights;
    }

    public String toString(){
        return "Fully booked flights: "+bookedFlights+" , Cancelled flights: "+cancelledFlights+" , Total flights: "+totalFlights;
    }
}
