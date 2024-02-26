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
        boolean requirement_1=false;
        boolean requirement_2=false;

        for(IntWritable v : values){
            if(v.get()==1){
                requirement_1=true;
            }
            if(v.get()==2){
                requirement_2=true;
            }
        }

        if(requirement_1&&requirement_2){
            context.write(key, NullWritable.get());
        }
    	
    }
}
