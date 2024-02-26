package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import it.polito.bigdata.hadoop.lab.WordCountWritable;

/**
 * Lab - Mapper
 */

/* Set the proper data types for the (key,value) pairs */
class MapperBigData2 extends
		Mapper<Text, // Input key type
				Text, // Input value type
				NullWritable, // Output key type
				WordCountWritable> {// Output value type

	private TopKVector<WordCountWritable> localTopK;
	private Integer k = 100;

	protected void setup(Context context) {
		localTopK = new TopKVector<WordCountWritable>(k);
	}

	protected void map(Text key, // Input key type
			Text value, // Input value type
			Context context) throws IOException, InterruptedException {

		// key = current pair of products
		// value = num. of occurrences of the current pair

		WordCountWritable currentPair = new WordCountWritable(key.toString(),
				Integer.valueOf(Integer.parseInt(value.toString())));

		// Try to insert the current pair in the local top-k list.
		// The updateWithNewElement method updates the local top-k list
		// by considering currentPair. If currentPair precedes at least one
		// of the current top k elements, then the content of localTopK is
		// updated.
		// Otherwise, the content of localTopK is not updated
		localTopK.updateWithNewElement(currentPair);

	}

	protected void cleanup(Context context) throws IOException, InterruptedException {
		// emit the local top-k list
		for (WordCountWritable p : localTopK.getLocalTopK()) {
			context.write(NullWritable.get(), new WordCountWritable(p));
		}
	}
}
