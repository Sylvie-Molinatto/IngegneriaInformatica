package it.polito.bigdata.spark.example;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateTool {

	public static Integer weekNumber(String date) {
		Date d=new Date();
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/dd");
		try {
			d = format.parse(date);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		Calendar cal = Calendar.getInstance();
		cal.setTime(d);
	
		return new Integer(cal.get(Calendar.WEEK_OF_YEAR));
	}
}

