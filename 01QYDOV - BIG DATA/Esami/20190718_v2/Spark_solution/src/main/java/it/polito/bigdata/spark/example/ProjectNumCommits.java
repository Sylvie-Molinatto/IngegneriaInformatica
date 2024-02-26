package it.polito.bigdata.spark.example;

import java.io.Serializable;

public class ProjectNumCommits implements Serializable{
    String project;
    int numCommits;

    public ProjectNumCommits(String project, int numCommits){
        this.project = project;
        this.numCommits = numCommits;
    }

    public String toString(){
         return project.split(" ")[0].substring(0,1)+project.split(" ")[1].substring(0,1);
    }
}
