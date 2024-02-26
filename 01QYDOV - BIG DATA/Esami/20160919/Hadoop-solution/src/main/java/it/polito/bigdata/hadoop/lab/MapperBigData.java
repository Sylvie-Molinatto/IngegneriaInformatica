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
            String fields[] = value.toString().split(",");

            String stationId = fields[0];
            String year = fields[1].substring(0,4);
            double PM10 = Double.parseDouble(fields[4]);
            double PM2_5 = Double.parseDouble(fields[5]);

            if(year.compareTo("2013")==0 && PM10>PM2_5){
                context.write(new Text(stationId), new IntWritable(1));
            }
    }
}
