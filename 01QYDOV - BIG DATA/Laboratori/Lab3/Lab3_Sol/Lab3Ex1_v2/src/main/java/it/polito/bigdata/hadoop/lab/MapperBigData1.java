package it.polito.bigdata.hadoop.lab;

import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

/**
 * Lab - Mapper
 */

/* Set the proper data types for the (key,value) pairs */
class MapperBigData1 extends
		Mapper<LongWritable, // Input key type
				Text, // Input value type
				Text, // Output key type
				IntWritable> {// Output value type

	protected void map(LongWritable key, // Input key type
			Text value, // Input value type
			Context context) throws IOException, InterruptedException {

		String[] items = value.toString().split(",");

		// i=0 - items[0] = customer id
		// i>=1 - items[i] = product id

		// Emit pairs product1,product2
		for (int p1 = 1; p1 < items.length; p1++) {
			for (int p2 = 1; p2 < items.length; p2++) {
				if (items[p1].compareTo(items[p2])<0) {
					context.write(new Text(items[p1] + "," + items[p2]), new IntWritable(1));
				}
			}
		}

	}
}
