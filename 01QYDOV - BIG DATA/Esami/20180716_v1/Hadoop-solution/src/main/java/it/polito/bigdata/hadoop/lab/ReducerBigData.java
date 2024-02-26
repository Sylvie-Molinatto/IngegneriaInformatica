package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

/**
 * Lab - Reducer
 */

/* Set the proper data types for the (key,value) pairs */
class ReducerBigData extends Reducer<
                Text,           // Input key type
                Text,    // Input value type
                Text,           // Output key type
                NullWritable> {  // Output value type
    
    @Override
    protected void reduce(
        Text key, // Input key type
        Iterable<Text> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        boolean requirement_1 = false;
        boolean requirement_2 = false;

        for(Text v : values){
            if(v.toString().compareTo("hard_drive")==0){
                requirement_1 = true;
            }
            if(v.toString().compareTo("RAM")==0){
                requirement_2 = true;
            }
        }

        if(requirement_1 && requirement_2){
            context.write(key, NullWritable.get());
        }
    	
    }
}
