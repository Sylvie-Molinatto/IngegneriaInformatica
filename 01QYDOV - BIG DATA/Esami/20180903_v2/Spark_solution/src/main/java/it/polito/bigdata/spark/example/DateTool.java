package it.polito.bigdata.spark.example;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateTool {

	public static String previousDate(String date) {
		return dateOffset(date, -1);
	}

	public static String dateOffset(String date, int deltaDays) {
		String newDate;

		Date d = new Date();

		SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/dd");
		try {
			d = format.parse(date);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		System.out.println(d);

		Calendar cal = Calendar.getInstance();
		cal.setTime(d);
		cal.add(Calendar.DATE, deltaDays);

		newDate = format.format(cal.getTime());

		return newDate;

	}

}
