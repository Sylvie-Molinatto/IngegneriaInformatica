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
        int sumMay = 0;
        int sumJune = 0;

        for(Text month : values){
            if(month.toString().compareTo("05")==0){
                sumMay++;
            }
            if(month.toString().compareTo("06")==0){
                sumJune++;
            }
        }

        if(sumJune>sumMay){
            context.write(key, NullWritable.get());
        }
    	
    }
}
