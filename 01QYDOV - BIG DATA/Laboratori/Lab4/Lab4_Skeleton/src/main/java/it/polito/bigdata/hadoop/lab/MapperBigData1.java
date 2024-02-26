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
class MapperBigData1 extends Mapper<
                    LongWritable, // Input key type
                    Text,         // Input value type
                    Text,         // Output key type
                    ProductRatingWritable> {// Output value type
    
    protected void map(
            LongWritable key,   // Input key type
            Text value,         // Input value type
            Context context) throws IOException, InterruptedException {

            // Filter the first line where there are headers 
            if (key.get() == 0){
                   return;
            }

    		/* Implement the map method */ 
            String[] info = value.toString().split(",");

            String productId = info[1];
            String userId = info[2];
            Integer score = Integer.parseInt(info[6]);

            context.write(new Text(userId), new ProductRatingWritable(productId, score));
            
    }
}
