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
                Text,    // Input value type
                Text,           // Output key type
                DoubleWritable> {  // Output value type
    
    @Override
    protected void reduce(
        Text key, // Input key type
        Iterable<Text> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        double cancelled = 0;
        double total = 0;
        for(Text t : values){
            if(t.toString().compareTo("yes")==0){
                cancelled++;
            }
            total++;
        }
        
        double percentage = cancelled/total*100;
        if(percentage>1){
            context.write(key, new DoubleWritable(percentage));
        }
    	
    }
}
