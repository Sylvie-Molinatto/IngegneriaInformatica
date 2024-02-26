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
                NullWritable,           // Input key type
                WordCountWritable,    // Input value type
                Text,           // Output key type
                IntWritable> {  // Output value type
    
    private TopKVector<WordCountWritable> topK = new TopKVector<>(100);
   
    @Override
    protected void reduce(
        NullWritable key, // Input key type
        Iterable<WordCountWritable> values, // Input value type
        Context context) throws IOException, InterruptedException {

		/* Implement the reduce method */
        for(WordCountWritable wcw : values){
            topK.updateWithNewElement(new WordCountWritable(wcw));
        }

        // Emit the global top k list
		for (WordCountWritable p : topK.getLocalTopK()) {
			context.write(new Text(p.getWord()), new IntWritable(p.getCount()));
        }
    }
}
