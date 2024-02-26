package it.polito.bigdata.spark.example;

import java.io.Serializable;
import java.util.Comparator;

import scala.Tuple2;

public class FreqComparatorTop implements Comparator<Tuple2<String, Integer>>, Serializable {

	private static final long serialVersionUID = 1L;

	@Override
	public int compare(Tuple2<String, Integer> pair1, Tuple2<String, Integer> pair2) {
		// Compare the number of occurrences of the two pairs of products
		// (i.e., the second field)
		return pair1._2().compareTo(pair2._2());
	}

}