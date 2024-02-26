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


	protected void map(Text key, // Input key type
			Text value, // Input value type
			Context context) throws IOException, InterruptedException {

		// key = current pair of products
		// value = num. of occurrences of the current pair

		WordCountWritable currentPair = new WordCountWritable(key.toString(),
				Integer.valueOf(Integer.parseInt(value.toString())));


		context.write(NullWritable.get(), new WordCountWritable(currentPair));

	}

}
