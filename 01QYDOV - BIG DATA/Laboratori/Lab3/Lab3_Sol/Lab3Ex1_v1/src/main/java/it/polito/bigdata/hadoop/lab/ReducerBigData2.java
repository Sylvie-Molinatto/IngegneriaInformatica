package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

/**
 * Lab - Reducer
 */

class ReducerBigData2 extends
		Reducer<NullWritable, // Input key type
				WordCountWritable, // Input value type
				Text, // Output key type
				IntWritable> { // Output value type

	private Integer k = 100;

	@Override
	protected void reduce(NullWritable key, // Input key type
			Iterable<WordCountWritable> values, // Input value type
			Context context) throws IOException, InterruptedException {

		TopKVector<WordCountWritable> globalTopK = new TopKVector<WordCountWritable>(k);

		// Each value in values is a pair of products + its count
		for (WordCountWritable currentPair : values) {
			// Update the current top k list with the current pair
			globalTopK.updateWithNewElement(new 
					WordCountWritable(currentPair));
		}

		// Emit the global top k list
		for (WordCountWritable p : globalTopK.getLocalTopK()) {
			context.write(new Text(p.getWord()), new IntWritable(p.getCount()));
		}

	}
}
