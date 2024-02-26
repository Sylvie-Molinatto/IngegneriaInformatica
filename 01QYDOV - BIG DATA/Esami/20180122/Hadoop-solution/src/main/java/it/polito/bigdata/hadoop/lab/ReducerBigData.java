package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
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
                IntWritable> {  // Output value type
    
    int highestNumPurchases;
    String bidMostPurchased;

    protected void setup(Context context){
        highestNumPurchases = Integer.MIN_VALUE;
        bidMostPurchased = null;
    }

    @Override
    protected void reduce(
        Text key, // Input key type
        Iterable<IntWritable> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */

        int numPurchases = 0;

        for(IntWritable v : values){
            numPurchases+=v.get();
        }

        if(numPurchases>highestNumPurchases || bidMostPurchased==null || (highestNumPurchases==numPurchases && key.toString().compareTo(bidMostPurchased)<0)){
            highestNumPurchases = numPurchases;
            bidMostPurchased = key.toString();
        }
    	
    }

    protected void cleanup(Context context) throws IOException, InterruptedException{
        context.write(new Text(bidMostPurchased), new IntWritable(highestNumPurchases));
    }
}
