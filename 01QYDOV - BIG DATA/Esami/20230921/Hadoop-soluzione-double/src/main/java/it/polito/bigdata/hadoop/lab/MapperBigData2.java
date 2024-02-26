package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

/**
 * Lab  - Mapper
 */

/* Set the proper data types for the (key,value) pairs */
class MapperBigData2 extends Mapper<
                    Text, // Input key type
                    Text,         // Input value type
                    Text,         // Output key type
                    Text> {// Output value type
    
    protected void map(
            Text key,   // Input key type
            Text value,         // Input value type
            Context context) throws IOException, InterruptedException {

    		/* Implement the map method */ 
            int shortSeasonCounter = Integer.parseInt(value.toString().split(",")[0]);
            int longSeasonCounter = Integer.parseInt(value.toString().split(",")[1]);
            String sid = key.toString();
            context.write(new Text(sid), new Text(""+shortSeasonCounter+"-"+longSeasonCounter));
    }
}
