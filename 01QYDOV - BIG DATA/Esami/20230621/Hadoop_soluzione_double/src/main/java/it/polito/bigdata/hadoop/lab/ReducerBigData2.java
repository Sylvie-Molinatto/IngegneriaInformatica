package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

/**
 * Lab - Reducer
 */

/* Set the proper data types for the (key,value) pairs */
class ReducerBigData2 extends Reducer<
                Text,           // Input key type
                IntWritable,    // Input value type
                Text,           // Output key type
                NullWritable> {  // Output value type
    
        int max;
        String midMax;
    
        protected void setup(Context context){
            this.max = Integer.MIN_VALUE;
            this.midMax = null;
        }
        
        @Override
        protected void reduce(
            Text key, // Input key type
            Iterable<IntWritable> values, // Input value type
            Context context) throws IOException, InterruptedException {
    
            /* Implement the reduce method */
            int sum = 0;
            for(IntWritable i : values){
                sum+=i.get();
            }
    
            if(midMax==null || sum>max || (sum==max && key.toString().compareTo(midMax)>0)){
                this.max = sum;
                this.midMax = key.toString();
            }
        }
    
        protected void cleanup(Context context) throws IOException, InterruptedException{
            context.write(new Text(midMax), NullWritable.get());
        }
}

