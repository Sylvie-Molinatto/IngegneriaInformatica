package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

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
                Text> {  // Output value type
    
    @Override
    protected void reduce(
        Text key, // Input key type
        Iterable<Text> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        boolean allEqual = true;
        String manufacturer = null;

        for(Text t : values){
            if(manufacturer!=null && manufacturer.compareTo(t.toString())!=0 ){
                allEqual=false;
            }
            manufacturer = t.toString();
        }

        if(allEqual){
            context.write(key, new Text(manufacturer));
        }
    	
    }
}
