package it.polito.bigdata.hadoop.lab;

import java.util.Vector;

public class TopKVector<T extends Comparable<T>> {

	private Vector<T> localTopK;
	private Integer k;

	public TopKVector(int k) {
		this.localTopK = new Vector<T>();
		this.k = k;
	}

	public void setK(int k) {
		this.k = k;
	}

	public int getK() {
		return this.k;
	}

	// Retrieve the vector containing the top k elements
	public Vector<T> getLocalTopK() {
		return this.localTopK;
	}

	/*
	 * Insert a new element in the current top k vector. The new element is
	 * inserted in the vector if an only if it is in the top k elements
	 */
	public void updateWithNewElement(T currentElement) {
		if (localTopK.size() < k) { // There are less than k elements
			// Add the current element at the end of the local top k vector
			localTopK.addElement(currentElement);
			// Sort the elements in localTopk
			sortAfterInsertNewElement();
		} else {
			// There are already k elements
			// Check if the current one is better than the least one
			if (currentElement.compareTo(localTopK.elementAt(k - 1)) > 0) {
				// The current element is better than the least element of
				// localTopK
				// Substitute the last element of localTopK with the current
				// pair
				localTopK.setElementAt(currentElement, k - 1);
				// Sort the elements in localTopk
				sortAfterInsertNewElement();
			}
		}
	}

	private void sortAfterInsertNewElement() {
		// The last element is the only one that is potentially not in the right
		// position
		T swap;

		for (int pos = localTopK.size() - 1; pos > 0
				&& localTopK.elementAt(pos).compareTo(localTopK.elementAt(pos - 1)) > 0; pos--) {
			swap = localTopK.elementAt(pos);
			localTopK.setElementAt(localTopK.elementAt(pos - 1), pos);
			localTopK.setElementAt(swap, pos - 1);
		}
	}

}
