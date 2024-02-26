package it.polito.bigdata.hadoop.lab;

import it.polito.bigdata.hadoop.lab.DriverBigData.MY_COUNTERS;
import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.conf.Configuration;

/**
 * Lab  - Mapper
 */

/* Set the proper data types for the (key,value) pairs */
class MapperBigData extends Mapper<
                    LongWritable, // Input key type
                    Text,         // Input value type
                    Text,         // Output key type
                    IntWritable> {// Output value type

    private String prefix;

    protected void map(
            LongWritable key,   // Input key type
            Text value,         // Input value type
            Context context) throws IOException, InterruptedException {

    		/* Implement the map method */ 
            
            // Get the prefix from arguments
            Configuration conf = context.getConfiguration();
            prefix = conf.get("prefix");

            // Increment total words counter
            context.getCounter(MY_COUNTERS.TOTAL_WORDS).increment(1);

            String line = value.toString();
            String[] words = line.split("\t");
            if(words.length == 2){
                String word = words[0];
                if(word.startsWith(prefix)){
                    // Increment selected words counter
                    context.getCounter(MY_COUNTERS.SELECTED_WORDS).increment(1);
                    context.write(new Text(word), new IntWritable(Integer.parseInt(words[1])));
                }
            }
    }
}
