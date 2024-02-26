package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

/**
 * Lab - Reducer
 */

/* Set the proper data types for the (key,value) pairs */
class ReducerBigData extends Reducer<
                NullWritable,           // Input key type
                Text,                   // Input value type
                DoubleWritable,         // Output key type
                Text> {                 // Output value type

    double lowest_price = Double.MAX_VALUE;
    String lastTimeStamp = null;

    @Override
    protected void reduce(
        NullWritable key, // Input key type
        Iterable<Text> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        for(Text t : values){
            String[] fields = t.toString().split(",");
            Double price = Double.parseDouble(fields[0]);
            String timeStamp = fields[1];
            if(price<lowest_price || (price==lowest_price && timeStamp.compareTo(lastTimeStamp)>0)){
                lowest_price = price;
                lastTimeStamp = timeStamp;
            }
        }

        context.write(new DoubleWritable(lowest_price), new Text(lastTimeStamp));
    	
    }
}
