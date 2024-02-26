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
                ShortLongSeasons> {  // Output value type
    
    @Override
    protected void reduce(
        Text key, // Input key type
        Iterable<IntWritable> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        // Compute the number of episoded of one season of a serie
        int numEpisodes=0;
        for(IntWritable i : values){
            numEpisodes += i.get();
        }

        String sid = key.toString().split("-")[0];

        if(numEpisodes<=10){ //short season
            context.write(new Text(sid), new ShortLongSeasons(1, 0));
        }
        else{ //long season
            context.write(new Text(sid), new ShortLongSeasons(0, 1));
        }
    	
    }
}
