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
                Text,           // Output key type
                NullWritable> {  // Output value type
    
    @Override
    protected void reduce(
        Text key, // Input key type
        Iterable<Text> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        boolean first_requirement = false;
        boolean second_requirement = false;

        for(Text v : values){
            String[] temp = v.toString().split(",");
            if(Double.parseDouble(temp[0])>35){
                first_requirement=true;
            }
            if(Double.parseDouble(temp[1])<-20){
                second_requirement=true;
            }
        }

        if(first_requirement && second_requirement){
            context.write(key, NullWritable.get());
        }
    	
    }
}
