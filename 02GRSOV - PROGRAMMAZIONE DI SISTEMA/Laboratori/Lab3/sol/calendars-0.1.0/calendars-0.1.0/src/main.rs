use std::cmp;
use std::mem;

type Bounds = (u32, u32);
type Schedule = Vec<Bounds>;

struct Calendar {
    schedule: Schedule,
    bounds: Bounds,
}

impl Calendar {
    fn from_hour(s: &str) -> u32 {
        let toks = s.split(":").collect::<Vec<&str>>();
        if toks.len() != 2 {
            panic!("hours must be in format h:mm")
        };
        toks[0].parse::<u32>().unwrap() * 60 + toks[1].parse::<u32>().unwrap()
    }

    fn to_hour(v: u32) -> String {
        format!("{:02}:{:02}", v / 60, v % 60)
    }

    fn common_intervals(
        duration: u32,
        calendar1: &Calendar,
        calendar2: &Calendar,
    ) -> Vec<(u32, u32)> {
        let mut res = Vec::new();

        let mut its = (calendar1.schedule.iter(), calendar2.schedule.iter()); // (active, other);
        let mut heads = (its.0.next(), its.1.next());

        let mut start = cmp::max(calendar1.bounds.0, calendar2.bounds.0);

        let mut check_interval = |(s_start, s_end): (u32, u32)| {
            if s_start > start && s_start - start >= duration {
                res.push((start, s_start));
            }
            if start < s_end {
                start = s_end;
            }
        };

        loop {
            // println!("{:?}", heads);

            let interval = match heads {
                (Some(v1), Some(v2)) => {
                    if v1.0 > v2.0 {
                        heads.1 = its.1.next();
                        *v2
                    } else {
                        heads.0 = its.0.next();
                        *v1
                    }
                }
                (Some(v1), None) => {
                    heads.0 = its.0.next();
                    *v1
                }
                (None, Some(v2)) => {
                    heads.1 = its.1.next();
                    *v2
                }
                (None, None) => break,
            };

            check_interval(interval);
        }
        let end = cmp::min(calendar1.bounds.1, calendar2.bounds.1);
        if end - start > duration {
            res.push((start, end))
        }

        res
    }
}

fn to_intervals(v: &Vec<Vec<&str>>) -> Schedule {
    v.iter()
        .map(|el| (Calendar::from_hour(el[0]), Calendar::from_hour(el[1])))
        .collect::<Vec<Bounds>>()
}

fn main() {
    let sched1 = vec![vec!["10:30", "12:00"], vec!["12:30", "14:50"], vec!["15:20", "16:00"]];
    let cal1 = Calendar {
        schedule: to_intervals(&sched1),
        bounds: (60 * 8, 60 * 20),
    };

    let cal2 = Calendar {
        schedule: to_intervals(&vec![vec!["8:30", "11:00"], vec!["14:00", "14:55"]]),
        bounds: (60 * 8, 60 * 18),
    };

    for (start, end) in Calendar::common_intervals(30, &cal1, &cal2) {
        println!("{} - {}", Calendar::to_hour(start), Calendar::to_hour(end));
    }
}
