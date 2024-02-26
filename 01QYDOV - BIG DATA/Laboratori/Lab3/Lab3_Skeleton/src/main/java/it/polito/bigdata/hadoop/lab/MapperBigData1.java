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
                    IntWritable> {// Output value type
    
    private Text pair = new Text();

    protected void map(
            LongWritable key,   // Input key type
            Text value,         // Input value type
            Context context) throws IOException, InterruptedException {
    		/* Implement the map method */
            // Split each sentence in words. Use commas as delimiter
            String[] products = value.toString().split(",");  

            // Emit all pairs of products in the same line
            for (int i = 1; i < products.length - 1; i++) {
                for (int j = i + 1; j < products.length; j++) {
                    if(products[i].compareTo(products[j]) < 0){
                        pair = new Text(products[i]+","+products[j]);
                       
                    }else{  
                        pair = new Text(products[j]+","+products[i]);
                    }
                   
                    context.write(pair, new IntWritable(1));
                    //System.out.println("key: "+pair.toString()+" value: "+1);
                }
            } 
    }
}
