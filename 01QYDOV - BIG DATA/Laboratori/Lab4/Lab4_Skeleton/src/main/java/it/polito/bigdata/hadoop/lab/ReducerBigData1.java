package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;
import java.util.HashMap;

/**
 * Lab - Reducer
 */

/* Set the proper data types for the (key,value) pairs */
class ReducerBigData1 extends Reducer<
                Text,           // Input key type
                ProductRatingWritable,    // Input value type
                Text,           // Output key type
                DoubleWritable> {  // Output value type
    
    @Override
    protected void reduce(
        Text key, // Input key type
        Iterable<ProductRatingWritable> values, // Input value type
        Context context) throws IOException, InterruptedException {

        HashMap<String, Double> productRating = new HashMap<String, Double>();
        // Calculate the average rating per user and subtract for each product
        double sum = 0;
        double count = 0;
        for(ProductRatingWritable p : values){
            productRating.put(p.getProductID(), p.getRating());
            sum+=p.getRating();
            count+=1;
        }

        double avg = sum/count;

        for(String productId : productRating.keySet()){
           context.write(new Text(productId), new DoubleWritable(productRating.get(productId) - avg));
        }
    	
    }
}
