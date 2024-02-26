package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

/**
 * Lab - Reducer
 */

/* Set the proper data types for the (key,value) pairs */
class ReducerBigData extends Reducer<
                Text,           // Input key type
                DoubleWritable,    // Input value type
                Text,           // Output key type
                Text> {  // Output value type
    
    @Override
    protected void reduce(
        Text key, // Input key type
        Iterable<DoubleWritable> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        double absoluteDifference = 0;
        double monthlyPercentage = 0;
        double min = Double.MAX_VALUE;
        double max = Double.MIN_VALUE;

        for(DoubleWritable v : values){
            if(v.get()<min){
                min = v.get();
            }
            if(v.get()>max){
                max = v.get();
            }
        }

        absoluteDifference = max - min;
        monthlyPercentage = (max - min)/min*100;

        if(monthlyPercentage>5){
            context.write(key, new Text(absoluteDifference+", "+monthlyPercentage));
        }
    	
    }
}
