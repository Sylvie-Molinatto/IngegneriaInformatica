struct MyCycle<I: Iterator + Clone> {
    orig: I,
    current: I,
    repeat: usize,
    infinite: bool,
}

impl<I: Iterator + Clone> MyCycle<I> {
    pub fn new(iter: I, repeat: usize) -> Self {
        let current = iter.clone();
        MyCycle {
            orig: iter,
            current,
            repeat,
            infinite: repeat == 0,
        }
    }
}

impl<I: Iterator + Clone> Iterator for MyCycle<I> {
    type Item = <I as Iterator>::Item;

    fn next(&mut self) -> Option<Self::Item> {
        match self.current.next() {
            Some(x) => Some(x),
            None if self.repeat > 1 || self.infinite => {
                self.current = self.orig.clone();
                if !self.infinite {
                    self.repeat -= 1;
                }
                self.current.next()
            }
            None => None,
        }
    }
}

impl<I: Iterator + Clone> Clone for MyCycle<I> {
    fn clone(&self) -> Self {
        MyCycle::new(self.orig.clone(), self.repeat)
    }
}

fn main() {
    let v: Vec<i32> = vec![1, 2];
    let it1 = MyCycle::new(v.iter(), 2);
    let it2 = MyCycle::new(v.iter(), 2);

    println!("{:?}", it1.zip(it2).next().unwrap());
}

#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    fn empy_it() {
        let v: Vec<i32> = vec![];
        let mut it = MyCycle::new(v.iter(), 0);
        assert_eq!(it.next(), None);
        assert_eq!(it.count(), 0);
    }

    #[test]
    fn cycle_of_cyle() {
        let v: Vec<i32> = vec![1, 2];
        let it1 = MyCycle::new(v.iter(), 2);
        let it2 = MyCycle::new(it1.clone(), 3);
        assert_eq!(it2.count(), 12);
    }

    #[test]
    fn test_zip() {
        let v: Vec<i32> = vec![1, 2];
        let it1 = MyCycle::new(v.iter(), 2);
        let it2 = MyCycle::new(v.iter(), 2);
        let mut itz = it1.zip(it2);

        assert_eq!(itz.next().unwrap(), (&1, &1));
        itz.next();
        assert_eq!(itz.next().unwrap(), (&1, &1));
    }

    #[test]
    fn test_chain() {
        let v: Vec<i32> = vec![1, 2];
        let it1 = MyCycle::new(v.iter(), 2);
        let it2 = MyCycle::new(v.iter(), 2);
        assert_eq!(it1.chain(it2).count(), 8);
    }
}
