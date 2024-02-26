package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class ApplicationMonth implements Serializable{
    String application;
    int month;

    public ApplicationMonth(String application, int month){
        this.application = application;
        this.month = month;
    }

    public boolean equals(Object o2) {
		String v1 = new String(month + application);
		String v2 = new String(((ApplicationMonth) o2).month + ((ApplicationMonth) o2).application);

		if (v1.compareTo(v2) == 0)
			return true;
		else
			return false;
	}

	@Override
	public int hashCode() {
		return (new String(this.month + this.application)).hashCode();
	}

    public String toString() {
		return month + "," + application;
	}

}
