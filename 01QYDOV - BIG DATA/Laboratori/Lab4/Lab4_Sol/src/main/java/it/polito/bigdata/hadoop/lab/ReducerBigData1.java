package it.polito.bigdata.hadoop.lab;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.mapreduce.Reducer;

/**
 * Lab 4 - Reducer first job
 */
class ReducerBigData1 extends Reducer<Text, // Input key type
		ProductIdRatingWritable, // Input value type
		Text, // Output key type
		DoubleWritable> { // Output value type

	@Override
	protected void reduce(Text key, // Input key type
			Iterable<ProductIdRatingWritable> values, // Input value type
			Context context) throws IOException, InterruptedException {

		HashMap<String, Double> productsRatings = new HashMap<String, Double>();

		int numRatings = 0;
		double totRatings = 0;

		String productId = "";
		double rating;
		double avg;

		// Iterate over the set of values and store them locally
		// because two iterations are needed. Since the number of rating
		// per user is a small set we can keep it in main memory
		for (ProductIdRatingWritable productIdRating : values) {

			// Extract productId and rating from value

			productId = productIdRating.getProductId();
			rating = productIdRating.getRating();

			productsRatings.put(productId, rating);

			numRatings++;
			totRatings = totRatings + rating;
		}

		avg = totRatings / (double) numRatings;

		for (Iterator<Entry<String, Double>> i = productsRatings.entrySet().iterator(); i.hasNext();) {
			Entry<String, Double> pair = i.next();
			productId = (String) pair.getKey();
			rating = (double) pair.getValue();

			context.write(new Text(productId), new DoubleWritable(rating - avg));
		}

	}
}
