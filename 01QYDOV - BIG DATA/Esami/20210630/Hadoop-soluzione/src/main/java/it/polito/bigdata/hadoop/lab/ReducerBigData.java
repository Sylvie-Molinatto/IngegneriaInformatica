package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

/**
 * Lab - Reducer
 */

/* Set the proper data types for the (key,value) pairs */
class ReducerBigData extends Reducer<
                Text,           // Input key type
                IntWritable,    // Input value type
                Text,           // Output key type
                NullWritable> {  // Output value type
    
    @Override
    protected void reduce(
        Text key, // Input key type
        Iterable<IntWritable> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        int sumEurope = 0;
        int sumOutEurope = 0;

        for(IntWritable i : values){
            if(i.get()==1){
                sumEurope++;
            }
            if(i.get()==2){
                sumOutEurope++;
            }
        }

        if(sumEurope>=10000 && sumOutEurope>=10000){
            context.write(key, NullWritable.get());
        }
    	
    }
}
