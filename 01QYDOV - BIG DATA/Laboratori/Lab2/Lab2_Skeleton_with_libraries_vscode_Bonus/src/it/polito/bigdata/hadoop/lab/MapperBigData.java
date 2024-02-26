package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
/**
 * Lab  - Mapper
 */

/* Set the proper data types for the (key,value) pairs */
class MapperBigData extends Mapper<
                    Text, // Input key type
                    Text,         // Input value type
                    Text,         // Output key type
                    Text> {// Output value type
    String search;

    protected void setup(Context context){
        search = context.getConfiguration().get("word");
    }
    protected void map(
            Text key,   // Input key type
            Text value,         // Input value type
            Context context) throws IOException, InterruptedException {

    		/* Implement the map method */ 
            String[] words = key.toString().split(" ");

            if (words[0].toLowerCase().equals(search.toLowerCase()) || words[1].toLowerCase().equals((search.toLowerCase()))) {
                context.write(key, value);
                System.out.println(key + "  " + value);
            }
    }
}
