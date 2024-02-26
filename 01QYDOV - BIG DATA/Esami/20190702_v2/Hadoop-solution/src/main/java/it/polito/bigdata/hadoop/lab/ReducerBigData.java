package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

/**
 * Lab - Reducer
 */

/* Set the proper data types for the (key,value) pairs */
class ReducerBigData extends Reducer<
                Text,           // Input key type
                Text,    // Input value type
                NullWritable,           // Output key type
                Text> {  // Output value type
    
    @Override
    protected void reduce(
        Text key, // Input key type
        Iterable<Text> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        boolean allEqual = true;
        String CPUversion = null;

        for(Text currentCPUversion : values){
            if(CPUversion!=null && currentCPUversion.toString().compareTo(CPUversion)!=0){
                allEqual = false;
            }
            CPUversion = currentCPUversion.toString();
        }

        if(allEqual){
            context.write(NullWritable.get(), new Text(key+","+CPUversion));
        }
    	
    }
}
