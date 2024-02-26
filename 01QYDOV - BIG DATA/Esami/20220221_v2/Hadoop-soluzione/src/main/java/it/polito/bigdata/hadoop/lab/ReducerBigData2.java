package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

/**
 * Lab - Reducer
 */

/* Set the proper data types for the (key,value) pairs */
class ReducerBigData2 extends Reducer<
                NullWritable,           // Input key type
                Text,                   // Input value type
                IntWritable,           // Output key type
                IntWritable> {  // Output value type
    
    int maxPurchases = Integer.MIN_VALUE;
    int yearMaxPurchases = 0;

    @Override
    protected void reduce(
        NullWritable key, // Input key type
        Iterable<Text> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        for(Text t : values){
            String[] fields = t.toString().split(",");
            int year = Integer.parseInt(fields[0]);
            int purchases = Integer.parseInt(fields[1]);

            if(purchases>maxPurchases || (purchases==maxPurchases && year<yearMaxPurchases)){
                maxPurchases = purchases;
                yearMaxPurchases = year;
            }
        }

        context.write(new IntWritable(yearMaxPurchases), new IntWritable(maxPurchases));
    	
    }
}
