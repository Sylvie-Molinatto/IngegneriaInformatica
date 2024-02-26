package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

/**
 * Lab  - Mapper
 */

/* Set the proper data types for the (key,value) pairs */
class MapperBigData extends Mapper<
                    LongWritable, // Input key type
                    Text,         // Input value type
                    Text,         // Output key type
                    IntWritable> {// Output value type
    
    protected void map(
            LongWritable key,   // Input key type
            Text value,         // Input value type
            Context context) throws IOException, InterruptedException {

    		/* Implement the map method */ 
            String[] fields = value.toString().split(",");

            String date = fields[1];
            int hour = Integer.parseInt(fields[2].substring(0,2));
            Double windSpeed = Double.parseDouble(fields[4]);

            if(date.startsWith("2018/04") && hour>=8 && hour<=11 && windSpeed<1.0){
                context.write(new Text(fields[0]), new IntWritable(1));
            }
    }
}
