package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.mapreduce.Reducer;

/**
 * Lab - Reducer
 */

/* Set the proper data types for the (key,value) pairs */
class ReducerBigData1 extends Reducer<
                IntWritable,           // Input key type
                IntWritable,    // Input value type
                IntWritable,           // Output key type
                IntWritable> {  // Output value type
    
    int maxPurchases;
    int yearMaxPurchases;

    protected void setup(Context context){
        maxPurchases = Integer.MIN_VALUE;
        yearMaxPurchases = 0;
    }

    @Override
    protected void reduce(
        IntWritable key, // Input key type
        Iterable<IntWritable> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        int sum = 0;
        for(IntWritable i : values){
            sum+=i.get();
        }
    	
        if(sum>maxPurchases || (sum==maxPurchases && key.get()<yearMaxPurchases)){
            maxPurchases = sum;
            yearMaxPurchases = key.get();
        }
    }

    protected void cleanup(Context context) throws IOException, InterruptedException {
        context.write(new IntWritable(yearMaxPurchases), new IntWritable(maxPurchases));
    }
}
