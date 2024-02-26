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
    int maxCount;
    String cityMaxCount;

    protected void setup(Context context){
        this.maxCount = Integer.MIN_VALUE;
        this.cityMaxCount = null;
    }
    
    @Override
    protected void reduce(
        Text key, // Input key type
        Iterable<IntWritable> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        int sum = 0;

        for (IntWritable i : values){
            sum += i.get();
        }
    	
        if(cityMaxCount==null || sum>maxCount || (sum==maxCount && key.toString().compareTo(cityMaxCount)<0)){
            maxCount = sum;
            cityMaxCount = key.toString();
        }
    }

    protected void cleanup(Context context) throws IOException, InterruptedException{
        context.write(new Text(cityMaxCount), new IntWritable(maxCount));
    }
}
