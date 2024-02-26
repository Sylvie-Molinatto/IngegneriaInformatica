package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

/**
 * Lab  - Mapper
 */

/* Set the proper data types for the (key,value) pairs */
class MapperBigData extends Mapper<
                    LongWritable, // Input key type
                    Text,         // Input value type
                    NullWritable, // Output key type
                    Text> {       // Output value type

    protected void map(
            LongWritable key,   // Input key type
            Text value,         // Input value type
            Context context) throws IOException, InterruptedException {

    		/* Implement the map method */ 
            String[] fields = value.toString().split(",");
            String stockId = fields[0];
            String date = fields[1];
            String time = fields[2];
            String current_timestamp = date+"_"+time;
            Double price = Double.parseDouble(fields[3]);

            if(stockId.compareTo("GOOG")==0 && date.startsWith("2017") == true){
                context.write(NullWritable.get(), new Text(price+","+current_timestamp));
            }

    }
}
