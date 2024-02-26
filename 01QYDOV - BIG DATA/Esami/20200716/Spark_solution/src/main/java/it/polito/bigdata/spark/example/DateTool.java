package it.polito.bigdata.spark.example;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateTool {

	public static String previousDeltaDate(String inputDate, int deltaDays) {
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
		Date d = new Date();

		try {
			d = format.parse(inputDate);
		} catch (ParseException e) {
			e.printStackTrace();
		}	

		Date newDate = new Date(d.getTime() - deltaDays * 24 * 3600 * 1000);
		
		return format.format(newDate);
	};


}
