package it.polito.bigdata.hadoop.lab;

import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;

public class ProductRatingWritable implements org.apache.hadoop.io.Writable {

    private String productID;
    private double rating;

    public ProductRatingWritable() {
    }

    public ProductRatingWritable(String productID, double rating) {
        this.productID = productID;
        this.rating = rating;
    }

    public String getProductID() {
        return productID;
    }

    public double getRating() {
        return rating;
    }

    public void setProductID(String productID) {
        this.productID = productID;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public void readFields(DataInput in) throws IOException {
        rating = in.readDouble();
        productID = in.readUTF();
    }

    public void write(DataOutput out) throws IOException {
        out.writeDouble(rating);
        out.writeUTF(productID);
    }
    
}
