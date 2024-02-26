package it.polito.bigdata.spark.example;
import java.io.Serializable;

@SuppressWarnings("serial")
public class DayOfWeekHourCriticality implements Serializable{
    
    public String dayOfWeek;
    public String hour;
    public Double criticality;

    public DayOfWeekHourCriticality(String dayOfWeek, String hour, Double criticality){
        this.dayOfWeek = dayOfWeek;
        this.hour = hour;
        this.criticality = criticality;
    }

    public String toString() {
		return dayOfWeek + "-" + hour + "-" + criticality;
	}
}
