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
                Text,           // Input value type
                Text,           // Output key type
                NullWritable> {  // Output value type
    
    @Override
    protected void reduce(
        Text key, // Input key type
        Iterable<Text> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        int num2017 = 0;
        int num2018 = 0;

        for(Text year : values){
            if(year.toString().compareTo("2017")==0){
                num2017++;
            }
            if(year.toString().compareTo("2018")==0){
                num2018++;
            }
        }

        if(num2018>num2017){
            context.write(key, NullWritable.get());
        }
    	
    }
}
