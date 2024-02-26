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
            String date = fields[0];
            Integer hour = Integer.parseInt(fields[1].substring(0,2));
            String vsid = fields[2];
            Double cpu_usage = Double.parseDouble(fields[3]);

            if(date.startsWith("2018/05") && hour>=9 && hour<=17 && cpu_usage>99.8){
                context.write(new Text(vsid), new IntWritable(1));
            }
    }
}
