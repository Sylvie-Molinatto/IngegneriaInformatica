package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

/**
 * Lab - Reducer
 */

/* Set the proper data types for the (key,value) pairs */
class ReducerBigData1 extends Reducer<
                Text,           // Input key type
                IntWritable,    // Input value type
                Text,           // Output key type
                IntWritable> {  // Output value type

    int max;
    String countryMax;

    protected void setup(Context context){
        this.max = Integer.MIN_VALUE;
        this.countryMax = null;
    }
    
    @Override
    protected void reduce(
        Text key, // Input key type
        Iterable<IntWritable> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        int sum = 0;
        String country = key.toString();
        for(IntWritable i : values){
            sum += i.get();
        }

        if(countryMax == null || sum>max || (sum==max && country.compareTo(countryMax)<0)){
            this.max = sum;
            this.countryMax = country;
        }
    	
    }

    protected void cleanup(Context context) throws IOException, InterruptedException{
        context.write(new Text(countryMax), new IntWritable(max));
    }
}
