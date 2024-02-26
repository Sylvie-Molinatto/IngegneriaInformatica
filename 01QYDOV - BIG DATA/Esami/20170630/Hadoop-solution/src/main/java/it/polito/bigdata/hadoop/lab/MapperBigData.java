package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.DoubleWritable;
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
                    DoubleWritable> {// Output value type
    
    protected void map(
            LongWritable key,   // Input key type
            Text value,         // Input value type
            Context context) throws IOException, InterruptedException {

    		/* Implement the map method */ 
            String[] fields = value.toString().split(",");
            String stockId = fields[0];
            String year = fields[1].substring(0,4);
            String month = fields[1].substring(5,7);
            double price = Double.parseDouble(fields[3]);

            if(year.compareTo("2016")==0){
                context.write(new Text(stockId+"_"+month), new DoubleWritable(price));
            }


    }
}
