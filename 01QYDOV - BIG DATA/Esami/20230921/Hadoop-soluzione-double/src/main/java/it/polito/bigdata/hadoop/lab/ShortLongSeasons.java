package it.polito.bigdata.hadoop.lab;

import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;

public class ShortLongSeasons implements org.apache.hadoop.io.Writable{

    private int shortSeasonCount;
    private int longSesonCount;

    public ShortLongSeasons(int shortSeasonCount, int longSesonCount){
        this.shortSeasonCount = shortSeasonCount;
        this.longSesonCount = longSesonCount;
    }
    
    public int getShortSeasonCount(){
        return this.shortSeasonCount;
    }

    public void setShortSeasonCount(int shortSeaonCount){
        this.shortSeasonCount = shortSeaonCount;
    }

    public int getLongSeasonCount(){
        return this.longSesonCount;
    }

    public void setLongSeasonCount(int longSesonCount){
        this.longSesonCount = longSesonCount;
    }

    @Override
    public void readFields(DataInput in) throws IOException {
		shortSeasonCount = in.readInt();
		longSesonCount = in.readInt();
	}

    @Override
	public void write(DataOutput out) throws IOException {
		out.writeInt(shortSeasonCount);
		out.writeInt(longSesonCount);
	}

    public String toString(){
        return ""+shortSeasonCount+","+longSesonCount;
    }
}
