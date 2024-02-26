package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class SeasonEpisodesCount implements Serializable{
    int seasonCount;
    int episodesCount;

    public SeasonEpisodesCount(int seasonCount, int episodesCount){
        this.seasonCount = seasonCount;
        this.episodesCount = episodesCount;
    }

    public String toString(){
        double avg = (double) episodesCount / (double) seasonCount;
        return ""+avg;
    }
}
