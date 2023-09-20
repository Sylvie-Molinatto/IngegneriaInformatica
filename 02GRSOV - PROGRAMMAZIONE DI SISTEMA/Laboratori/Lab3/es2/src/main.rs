struct MyCycle<I>
where
    I: Clone + Iterator,
{
    base_iterator: I,
    repeat: usize,
    current_iterator: Option<I>,
    current_repeat: usize,
}

impl<I> MyCycle<I>
where
    I: Clone + Iterator,
{
    fn new(iter: I, repeat: usize) -> MyCycle<I> {
        MyCycle {
            base_iterator: iter.clone(),
            repeat,
            current_iterator: Some(iter),
            current_repeat: 0,
        }
    }
}

impl<I> Iterator for MyCycle<I>
where
    I: Clone + Iterator,
{
    type Item = I::Item;

    fn next(&mut self) -> Option<Self::Item> {
        match &mut self.current_iterator {
            Some(iterator) => {
                if let Some(item) = iterator.next() {
                    Some(item)
                } else {
                    self.current_repeat += 1;
                    if self.current_repeat < self.repeat {
                        self.current_iterator = Some(self.base_iterator.clone());
                        self.current_iterator.as_mut().unwrap().next()
                    } else {
                        None
                    }
                }
            }
            None => None,
        }
    }
}

fn main(){

}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_my_cycle_zero_elements() {
        let vec: Vec<i32> = Vec::new();
        let cycle = MyCycle::new(vec.into_iter(), 5);

        assert_eq!(cycle.count(), 0);
    }

    #[test]
    fn test_my_cycle_repeat() {
        let vec: Vec<i32> = vec![1, 2, 3];
        let cycle = MyCycle::new(vec.into_iter(), 2);
        let result: Vec<i32> = cycle.collect();

        assert_eq!(result, vec![1, 2, 3, 1, 2, 3]);
    }

    #[test]
    fn test_my_cycle_chain() {
        let vec1: Vec<i32> = vec![1, 2, 3];
        let vec2: Vec<i32> = vec![4, 5];
        let cycle1 = MyCycle::new(vec1.into_iter(), 2);
        let cycle2 = MyCycle::new(vec2.into_iter(), 3);
        let chained_cycle = cycle1.chain(cycle2);
        let result: Vec<i32> = chained_cycle.collect();

        assert_eq!(result, vec![1, 2, 3, 1, 2, 3, 4, 5, 4, 5, 4, 5]);
    }

    #[test]
    fn test_my_cycle_zip() {
        let vec1: Vec<i32> = vec![1, 2, 3];
        let vec2: Vec<i32> = vec![4, 5, 6];
        let cycle1 = MyCycle::new(vec1.into_iter(), 2);
        let cycle2 = MyCycle::new(vec2.into_iter(), 3);
        let zipped_cycle = cycle1.zip(cycle2);
        let result: Vec<(i32, i32)> = zipped_cycle.collect();

        assert_eq!(
            result,
            vec![(1, 4), (2, 5), (3, 6), (1, 4), (2, 5), (3, 6)]
        );
    }
}

