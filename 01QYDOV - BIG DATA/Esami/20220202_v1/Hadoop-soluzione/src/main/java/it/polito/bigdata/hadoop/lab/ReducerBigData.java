package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.IntWritable;
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
                IntWritable> {  // Output value type
    
    @Override
    protected void reduce(
        Text key, // Input key type
        Iterable<DoubleWritable> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        int sumFree = 0;
        int sumPayment = 0;

        for(DoubleWritable price : values){
            if(price.get()==0){
                sumFree++;
            }
            else{
                sumPayment++;
            }
        }

        if(sumFree>sumPayment){
            context.write(key, new IntWritable(sumFree+sumPayment));
        }
    	
    }
}
