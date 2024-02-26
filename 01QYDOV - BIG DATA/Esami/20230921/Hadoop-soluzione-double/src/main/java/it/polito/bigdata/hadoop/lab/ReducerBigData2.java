package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

/**
 * Lab - Reducer
 */

/* Set the proper data types for the (key,value) pairs */
class ReducerBigData2 extends Reducer<
                Text,           // Input key type
                Text,    // Input value type
                Text,           // Output key type
                Text> {  // Output value type
    
    @Override
    protected void reduce(
        Text key, // Input key type
        Iterable<Text> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        String sid = key.toString();
        int sumShortSeason = 0;
        int sumLongSeason = 0;
        for(Text t : values){
            sumShortSeason += Integer.parseInt(t.toString().split("-")[0]);
            sumLongSeason += Integer.parseInt(t.toString().split("-")[1]);
        }

        context.write(new Text(sid), new Text(""+sumShortSeason+","+sumLongSeason));
    }
}
