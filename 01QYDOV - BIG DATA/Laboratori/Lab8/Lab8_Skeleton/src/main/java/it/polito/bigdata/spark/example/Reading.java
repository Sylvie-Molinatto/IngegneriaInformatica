package it.polito.bigdata.spark.example;

import java.io.Serializable;
import java.sql.Timestamp;

@SuppressWarnings("serial")
public class Reading implements Serializable{

    private int station;
    private Timestamp timestamp;
    private  int used_slots;
    private int free_slots;

    public int getStation() {
        return station;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public int getUsed_slots() {
        return used_slots;
    }

    public int getFree_slots() {
        return free_slots;
    }

    public void setStation(int station_id) {
        this.station = station_id;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    public void setUsed_slots(int used_slots) {
        this.used_slots = used_slots;
    }

    public void setFree_slots(int free_slots) {
        this.free_slots = free_slots;
    }

}
