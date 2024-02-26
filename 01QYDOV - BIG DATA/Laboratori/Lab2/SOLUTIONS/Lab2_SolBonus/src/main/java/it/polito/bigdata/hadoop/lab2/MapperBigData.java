package it.polito.bigdata.hadoop.lab2;

import java.io.IOException;

import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.Mapper;

/**
 * Mapper
 */
class MapperBigData extends
		Mapper<Text, // Input key type
				Text, // Input value type
				Text, // Output key type
				Text> {// Output value type

	String search;

	protected void setup(Context context) {
		search = context.getConfiguration().get("search").toString();
	}

	protected void map(Text key, 	// Input key type
			Text value, 			// Input value type
			Context context) throws IOException, InterruptedException {

		//Split the bigram
		String[] words = key.toString().split(" ");
		//Matches either the first or the second word
		if (words[0].equals(search) || words[1].equals(search))
			context.write(key, value);
	}

}
