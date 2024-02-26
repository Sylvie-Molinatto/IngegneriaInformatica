package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

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
                    Text> {       // Output value type
    
    protected void map(
            LongWritable key,   // Input key type
            Text value,         // Input value type
            Context context) throws IOException, InterruptedException {

    		/* Implement the map method */ 
            String fields[] = value.toString().split(",");
            String year = fields[1].substring(0,4);
            String month = fields[1].substring(5,7);
            String contributor = fields[3];

            if(year.compareTo("2019")==0 && (month.compareTo("05")==0 || month.compareTo("06")==0)){
                context.write(new Text(contributor), new Text(month));
            }
    }
}
