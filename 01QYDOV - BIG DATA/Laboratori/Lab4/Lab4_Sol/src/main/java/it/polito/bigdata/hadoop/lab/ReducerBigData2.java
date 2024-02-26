package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.mapreduce.Reducer;

/**
 *  Lab 4 - Reducer second job
 */
class ReducerBigData2 extends Reducer<
                Text,           // Input key type
                DoubleWritable,    // Input value type
                Text,    // Output key type
                DoubleWritable> {  // Output value type
    
    @Override
    protected void reduce(
        Text key, // Input key type
        Iterable<DoubleWritable> values, // Input value type
        Context context) throws IOException, InterruptedException {

    	int numRatings=0;
    	double totRatings=0;

    	double avg;
    	
        // Iterate over the set of values
        for (DoubleWritable rating : values) {
            numRatings++;
        	totRatings=totRatings+rating.get();
        }

        avg=totRatings/(double)numRatings;
        
        
        context.write(new Text(key), new DoubleWritable(avg));
        
    }
}
