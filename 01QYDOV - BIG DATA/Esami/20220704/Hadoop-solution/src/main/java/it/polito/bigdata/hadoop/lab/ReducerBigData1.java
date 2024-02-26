package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

/**
 * Lab - Reducer
 */

/* Set the proper data types for the (key,value) pairs */
class ReducerBigData1 extends Reducer<
                Text,           // Input key type
                IntWritable,    // Input value type
                Text,           // Output key type
                IntWritable> {  // Output value type
    int maxPatch;
    String serverMaxPatch;

    protected void setup(Context context){
        maxPatch = Integer.MIN_VALUE;
        serverMaxPatch = null;
    }

    @Override
    protected void reduce(
        Text key, // Input key type
        Iterable<IntWritable> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        int numPatch = 0;
        for(IntWritable i : values){
            numPatch+=i.get();
        }

        if(numPatch>maxPatch || (numPatch==maxPatch && key.toString().compareTo(serverMaxPatch)<0)){
            maxPatch = numPatch;
            serverMaxPatch = key.toString();
        }
    	
    }

    protected void cleanup(Context context) throws IOException, InterruptedException{
        context.write(new Text(serverMaxPatch), new IntWritable(maxPatch));
    }
}
