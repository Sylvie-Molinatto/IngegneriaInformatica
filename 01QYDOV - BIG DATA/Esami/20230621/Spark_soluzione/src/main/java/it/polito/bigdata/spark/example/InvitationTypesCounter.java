package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class InvitationTypesCounter implements Serializable{
    int largeMeetingsCount;
    int mediumMeetingsCount;
    int smallMeetingsCount;

    public InvitationTypesCounter(int largeMeetingsCount, int mediumMeetingsCount, int smallMeetingsCount){
        this.largeMeetingsCount = largeMeetingsCount;
        this.mediumMeetingsCount = mediumMeetingsCount;
        this.smallMeetingsCount = smallMeetingsCount;
    }

    public String toString(){
        return ""+largeMeetingsCount+","+mediumMeetingsCount+","+smallMeetingsCount;
    }
}
