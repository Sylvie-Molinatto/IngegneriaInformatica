use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;
use std::io::BufReader;
use chrono::{NaiveTime, Duration};

struct Calendar {
    schedule: Vec<(NaiveTime, NaiveTime)>,
    bounds: (NaiveTime, NaiveTime)
}

impl Calendar {
    fn new(schedule: Vec<(NaiveTime, NaiveTime)>, bounds: (NaiveTime, NaiveTime)) -> Calendar {
        Calendar {
            schedule,
            bounds
        }
    }

    fn available_time_slots(&self, duration: Duration) -> Vec<(NaiveTime, NaiveTime)> {
        let mut available_slots = Vec::new();
        let mut previous_end = self.bounds.0;
        for (start, end) in self.schedule.iter() {
            if previous_end + duration <= *start {
                available_slots.push((previous_end, *start));
            }
            previous_end = *end;
        }
        if previous_end + duration <= self.bounds.1 {
            available_slots.push((previous_end, self.bounds.1));
        }
        available_slots
    }
    
}

fn parse_calendar_file(path: &Path) -> io::Result<Calendar> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);
    let mut lines = reader.lines();
    let start_time= NaiveTime::parse_from_str(lines.next().unwrap().as_ref().unwrap(), "%H:%M").unwrap();
    let end_time= NaiveTime::parse_from_str(lines.next().unwrap().as_ref().unwrap(), "%H:%M").unwrap();
    let mut schedule = Vec::new();

    while let (Some(line1), Some(line2)) = (lines.next(), lines.next()) {
        let start = NaiveTime::parse_from_str(line1.unwrap().as_str(), "%H:%M").expect("");
        let end = NaiveTime::parse_from_str(line2.unwrap().as_str(), "%H:%M").expect("");
        schedule.push((start, end));
    }
 
    Ok(Calendar::new(schedule, (start_time, end_time)))
    
}

fn non_overlapped_time_slots(available_slots: Vec<(NaiveTime,NaiveTime)>)-> Vec<(NaiveTime,NaiveTime)>{
    let mut non_overlapped_slots : Vec<(NaiveTime,NaiveTime)> = Vec::new();

    for x in (0..available_slots.len()).step_by(2){
        if (available_slots[x].0 <= available_slots[x+1].0) & (available_slots[x].1 >= available_slots[x+1].1) {
            non_overlapped_slots.push(available_slots[x+1]);
        }
        else{
            non_overlapped_slots.push(available_slots[x]);
            non_overlapped_slots.push(available_slots[x+1]);
        }
        
    }
    non_overlapped_slots
}

fn main() {
    /*
    let args: Vec<String> = std::env::args().collect();

    if args.len() != 4 {
        eprintln!("Usage: cargo run -- <calendar1_file> <calendar2_file> <duration_in_minutes>");
        std::process::exit(1);
    }

     */

    let cal1_path = Path::new("cal1.txt");
    let cal2_path = Path::new("cal2.txt");
    let duration = Duration::minutes(30);

    let cal1 = parse_calendar_file(cal1_path).unwrap();
    let cal2 = parse_calendar_file(cal2_path).unwrap();

    let mut available_slots = Vec::new();
    available_slots.append(&mut cal1.available_time_slots(duration));
    available_slots.append(&mut cal2.available_time_slots(duration));
    available_slots.sort();
    let non_overlapped_slots = non_overlapped_time_slots(available_slots);

    for (start, end) in non_overlapped_slots {
        println!("{} {}", start.format("%H:%M"), end.format("%H:%M"));
    }
}


#[cfg(test)]
mod tests {
    use super::*;
    use chrono::NaiveTime;

    #[test]
    fn test_available_time_slots_both_calendars_empty() {
        let schedule1: Vec<(NaiveTime, NaiveTime)> = vec![];
        let bounds1 = (NaiveTime::from_hms(9, 0, 0), NaiveTime::from_hms(17, 0, 0));
        let calendar1 = Calendar::new(schedule1, bounds1);

        let schedule2: Vec<(NaiveTime, NaiveTime)> = vec![];
        let bounds2 = (NaiveTime::from_hms(9, 0, 0), NaiveTime::from_hms(17, 0, 0));
        let calendar2 = Calendar::new(schedule2, bounds2);

        let duration = Duration::minutes(30);

        let available_slots = calendar1.available_time_slots(duration);
        assert_eq!(available_slots, vec![(bounds1.0, bounds1.1)]);

        let available_slots = calendar2.available_time_slots(duration);
        assert_eq!(available_slots, vec![(bounds2.0, bounds2.1)]);
    }

    #[test]
    fn test_available_time_slots_both_empty() {
        let schedule1: Vec<(NaiveTime, NaiveTime)> = vec![ (NaiveTime::from_hms(9, 0, 0), NaiveTime::from_hms(10, 0, 0)),
                                                           (NaiveTime::from_hms(10, 0, 0), NaiveTime::from_hms(11, 0, 0)),
                                                           (NaiveTime::from_hms(15, 0, 0), NaiveTime::from_hms(17, 0, 0)),];
        let bounds1 = (NaiveTime::from_hms(9, 0, 0), NaiveTime::from_hms(17, 0, 0));
        let calendar1 = Calendar::new(schedule1, bounds1);

        let schedule2: Vec<(NaiveTime, NaiveTime)> = vec![ (NaiveTime::from_hms(9, 0, 0), NaiveTime::from_hms(10, 30, 0)),
                                                           (NaiveTime::from_hms(10, 30, 0), NaiveTime::from_hms(11, 30, 0)),
                                                           (NaiveTime::from_hms(15, 0, 0), NaiveTime::from_hms(17, 0, 0)),];
        let bounds2 = (NaiveTime::from_hms(9, 0, 0), NaiveTime::from_hms(17, 0, 0));
        let calendar2 = Calendar::new(schedule2, bounds2);

        let duration = Duration::minutes(30);

        let mut available_slots = Vec::new();
        available_slots.append(&mut calendar1.available_time_slots(duration));
        available_slots.append(&mut calendar2.available_time_slots(duration));

        let non_overlapped = non_overlapped_time_slots(available_slots);
        assert_eq!(non_overlapped, vec![(NaiveTime::from_hms(11, 30, 0), NaiveTime::from_hms(15, 0, 0))]);
       
    }

    #[test]
    fn test_available_time_slots_full_calendar() {
        let schedule: Vec<(NaiveTime, NaiveTime)> = vec![
            (NaiveTime::from_hms(9, 0, 0), NaiveTime::from_hms(10, 0, 0)),
            (NaiveTime::from_hms(10, 0, 0), NaiveTime::from_hms(15, 0, 0)),
            (NaiveTime::from_hms(15, 0, 0), NaiveTime::from_hms(17, 0, 0)),
        ];
        let bounds = (NaiveTime::from_hms(9, 0, 0), NaiveTime::from_hms(17, 0, 0));
        let calendar = Calendar::new(schedule, bounds);

        let duration = Duration::minutes(30);

        let available_slots = calendar.available_time_slots(duration);
        assert_eq!(available_slots, vec![]);
    }

    #[test]
    fn test_available_time_slots_insufficient_available_time() {
        let schedule: Vec<(NaiveTime, NaiveTime)> = vec![
            (NaiveTime::from_hms(9, 0, 0), NaiveTime::from_hms(10, 0, 0)),
            (NaiveTime::from_hms(11, 0, 0), NaiveTime::from_hms(12, 0, 0)),
            (NaiveTime::from_hms(13, 0, 0), NaiveTime::from_hms(16, 0, 0)),
        ];
        let bounds = (NaiveTime::from_hms(9, 0, 0), NaiveTime::from_hms(17, 0, 0));
        let calendar = Calendar::new(schedule, bounds);

        let duration = Duration::minutes(120);

        let available_slots = calendar.available_time_slots(duration);
        assert_eq!(available_slots, vec![]);
    }

    #[test]
    fn test_available_time_slots_available_at_start_and_end() {
        let schedule: Vec<(NaiveTime, NaiveTime)> = vec![
            (NaiveTime::from_hms(11, 0, 0), NaiveTime::from_hms(13, 0, 0)),
            (NaiveTime::from_hms(13, 0, 0), NaiveTime::from_hms(14, 0, 0)),
        ];
        let bounds = (NaiveTime::from_hms(8, 0, 0), NaiveTime::from_hms(17, 0, 0));
        let calendar = Calendar::new(schedule, bounds);

        let duration = Duration::minutes(120);

        let available_slots = calendar.available_time_slots(duration);
        assert_eq!(available_slots, vec![(NaiveTime::from_hms(8, 0, 0), NaiveTime::from_hms(11, 0, 0)),
                                         (NaiveTime::from_hms(14, 0, 0), NaiveTime::from_hms(17, 0, 0))]);
    }

    #[test]
    fn test_available_time_slots_exact_duration_available() {
        let schedule: Vec<(NaiveTime, NaiveTime)> = vec![
            (NaiveTime::from_hms(9, 0, 0), NaiveTime::from_hms(12, 0, 0)),
            (NaiveTime::from_hms(13, 0, 0), NaiveTime::from_hms(14, 0, 0)),
            (NaiveTime::from_hms(14, 0, 0), NaiveTime::from_hms(17, 0, 0))
        ];
        let bounds = (NaiveTime::from_hms(9, 0, 0), NaiveTime::from_hms(17, 0, 0));
        let calendar = Calendar::new(schedule, bounds);

        let duration = Duration::minutes(60);

        let available_slots = calendar.available_time_slots(duration);
        assert_eq!(available_slots, vec![(NaiveTime::from_hms(12, 0, 0), NaiveTime::from_hms(13, 0, 0))]);
    }
}
