package it.polito.bigdata.spark.sparkmllib;

import java.io.Serializable;

@SuppressWarnings("serial")
public class LabeledDocument implements Serializable {
	  private double label;
	  private String text;

	  public LabeledDocument(double label, String text) {
	    this.text = text;
	    this.label = label;
	  }

	  public String getText() { return this.text; }
	  public void setText(String text) { this.text = text; }

	  public double getLabel() { return this.label; }
	  public void setLabel(double label) { this.label = label; }
	}

