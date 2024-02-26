package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

/**
 * Lab - Reducer
 */

/* Set the proper data types for the (key,value) pairs */
class ReducerBigData2 extends Reducer<
                NullWritable,      // Input key type
                Text,             // Input value type
                Text,            // Output key type
                NullWritable> { // Output value type
    
    @Override
    protected void reduce(
        NullWritable key, // Input key type
        Iterable<Text> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        int maxPatches = Integer.MIN_VALUE;
        String serverMaxPatches = null;

        for(Text t : values){
            String[] fields = t.toString().split(",");
            String server = fields[0];
            int patches = Integer.parseInt(fields[1]);
            if(patches>maxPatches || (patches==maxPatches && server.compareTo(serverMaxPatches)<0)){
                maxPatches = patches;
                serverMaxPatches = server;
            }
        }
        context.write(new Text(serverMaxPatches), NullWritable.get());
    }
}
