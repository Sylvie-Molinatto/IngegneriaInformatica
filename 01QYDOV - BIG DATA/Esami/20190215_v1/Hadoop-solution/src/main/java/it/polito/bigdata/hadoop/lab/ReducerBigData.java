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
        int sumTot = 0;
        int sumMuseum = 0;
        for(Text t : values){
            if(t.equals("museum")==true){
                sumMuseum+=1;
            }
            sumTot+=1;
        }
    	
        if(sumTot>=1000 && sumMuseum>=20){
            context.write(key, NullWritable.get());
        }
    }
}
