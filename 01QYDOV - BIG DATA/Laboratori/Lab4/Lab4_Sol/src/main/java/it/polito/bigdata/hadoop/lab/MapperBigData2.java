package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.io.DoubleWritable;

import org.apache.hadoop.mapreduce.Mapper;

/**
 * Lab 4 - Mapper second job
 */
class MapperBigData2 extends Mapper<
                    Text,  // Input key type
                    Text, 		  // Input value type
                    Text,         // Output key type
                    DoubleWritable> {		  // Output value type
    
	
    protected void map(
    		Text key,	// Input key type
            Text value,         // Input value type
            Context context) throws IOException, InterruptedException {

    	
            double rating=Double.parseDouble(value.toString());
            
            context.write(new Text(key), new DoubleWritable(rating));
            
    }
}
