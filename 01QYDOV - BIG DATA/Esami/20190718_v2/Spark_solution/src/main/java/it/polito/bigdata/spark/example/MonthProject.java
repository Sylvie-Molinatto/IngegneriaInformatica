package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class MonthProject implements Serializable{
    private int month;
    private String project;

    public MonthProject(int month, String project){
        this.month = month;
        this.project = project;
    }

    public int getMonth(){
        return this.month;
    }

    public void setMonth(int month){
        this.month = month;
    }

    public String getProject(){
        return this.project;
    }

    public void setProject(String project){
        this.project = project;
    }

    public String toString(){
        return month+","+project;
    }

    // The objects of this class are used as keys of JavaPairRDDs. Hence, custom
	// versions of the methods equals and hashCode must be defined
	public boolean equals(Object o2) {
		String v1 = new String(month + project);
		String v2 = new String(((MonthProject) o2).getMonth() + ((MonthProject) o2).getProject());

		if (v1.compareTo(v2) == 0)
			return true;
		else
			return false;
	}

	@Override
	public int hashCode() {
		return (new String(this.month + this.project)).hashCode();
	}
}
