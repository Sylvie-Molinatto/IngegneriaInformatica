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
            String rid = fields[0];
            String codeType = fields[1];
            String date = fields[3];

            if(codeType.compareTo("FCode100")==0){
                if(date.startsWith("2015/01")){
                    context.write(new Text(rid), new IntWritable(1));
                }
                else if(date.startsWith("2015/02")){
                    context.write(new Text(rid), new IntWritable(2));
                }
            }
    }
}
