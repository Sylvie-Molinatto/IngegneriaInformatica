package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.io.LongWritable;

import org.apache.hadoop.mapreduce.Mapper;

/**
 * Lab 4 - Mapper first job
 */
class MapperBigData1 extends Mapper<LongWritable, // Input key type
		Text, // Input value type
		Text, // Output key type
		ProductIdRatingWritable> { // Output value type

	protected void map(LongWritable key, // Input key type
			Text value, // Input value type
			Context context) throws IOException, InterruptedException {

		// Extract the fields of the review
		String[] fields = value.toString().split(",");

		// Check if it is a review or the name of the attributes
		if (fields[0].compareTo("Id") != 0) { // It is a review
			String productId = fields[1];
			String userId = fields[2];
			int rating = Integer.parseInt(fields[6]);

			// emit the pair (userId, productId+rating)
			context.write(new Text(userId), new ProductIdRatingWritable(productId, rating));
		}
	}
}
