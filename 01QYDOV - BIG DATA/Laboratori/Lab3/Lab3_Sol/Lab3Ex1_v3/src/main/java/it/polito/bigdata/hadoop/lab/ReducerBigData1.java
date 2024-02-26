package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

/**
 * Lab - Reducer
 */

/* Set the proper data types for the (key,value) pairs */
class ReducerBigData1 extends
		Reducer<Text, // Input key type
				IntWritable, // Input value type
				Text, // Output key type
				IntWritable> { // Output value type

	private TopKVector<WordCountWritable> localTopK;
	private Integer k = 100;

	protected void setup(Context context) {
		localTopK = new TopKVector<WordCountWritable>(k);
	}

	@Override
	protected void reduce(Text key, // Input key type
			Iterable<IntWritable> values, // Input value type
			Context context) throws IOException, InterruptedException {

		// key = current pair of products
		// values = list of ones
		// Count the number of occurrences of each input pair
		// (product1,product2)
		int count = 0;

		for (IntWritable value : values) {
			count = count + value.get();
		}

		// key = current pair of products
		// count = num. of occurrences of the current pair
		WordCountWritable currentPair = 
				new WordCountWritable(key.toString(), Integer.valueOf(count));

		// Try to insert the current pair in the local top k list.
		// The updateWithNewElement method updates the local top k list
		// by considering currentPair. If currentPair precedes at least one
		// of the current top k elements, then the content of localTopK is
		// updated.
		// Otherwise, the content of localTopK is not updated
		localTopK.updateWithNewElement(currentPair);

	}

	protected void cleanup(Context context) throws IOException, InterruptedException {
		// emit the local top K list
		for (WordCountWritable p : localTopK.getLocalTopK()) {
			context.write(new Text(p.getWord()), new IntWritable(p.getCount()));
		}
	}
}
