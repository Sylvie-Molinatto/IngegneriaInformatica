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
        String firstCustomer=null;
        boolean unique = true;
        for(Text customer : values){
            String currentCustomer = customer.toString();
            if(firstCustomer==null){
                firstCustomer = currentCustomer;
            }
            else{
                if(firstCustomer.compareTo(currentCustomer)!=0){
                    unique = false;
                }
            }
        }

        if(unique){
            context.write(key, NullWritable.get());
        }
    	
    }
}
