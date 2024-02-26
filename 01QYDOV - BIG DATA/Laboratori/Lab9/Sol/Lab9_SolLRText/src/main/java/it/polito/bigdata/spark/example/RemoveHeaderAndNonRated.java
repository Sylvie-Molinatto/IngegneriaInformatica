package it.polito.bigdata.spark.example;

import org.apache.spark.api.java.function.Function;

@SuppressWarnings("serial")
public class RemoveHeaderAndNonRated implements Function<String, Boolean> {

	@Override
	public Boolean call(String line) throws Exception {
		String[] fields = line.split(",(?=([^\"]*\"[^\"]*\")*[^\"]*$)");
		//Id,ProductId,UserId,ProfileName,HelpfulnessNumerator,HelpfulnessDenominator,Score,Time,Summary,Text
		
		if (line.startsWith("Id")) {
			return false;
		}
		
		int helpfulnessDen = Integer.parseInt(fields[5]);

		if (helpfulnessDen==0) {
			return false;
		} else {
			return true;
		}
	}

}
