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
class ReducerBigData extends Reducer<
                Text,           // Input key type
                NullWritable,    // Input value type
                IntWritable,           // Output key type
                NullWritable> {  // Output value type
    int numRobots;

    protected void setup(Context context){
        numRobots = 0;
    }
    
    @Override
    protected void reduce(
        Text key, // Input key type
        Iterable<NullWritable> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        numRobots++;
    	
    }

    protected void cleanup(Context context) throws IOException, InterruptedException{
        context.write(new IntWritable(numRobots), NullWritable.get());
    }
}
