package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class GenreDetails implements Serializable{
    int totalBooks;
    int unsoldBooks;

    public GenreDetails(int totalBooks, int unsoldBooks){
        this.totalBooks = totalBooks;
        this.unsoldBooks = unsoldBooks;
    }

    public String toString(){
       return new String(""+100.0*(double)unsoldBooks/(double)totalBooks);
    }
}
