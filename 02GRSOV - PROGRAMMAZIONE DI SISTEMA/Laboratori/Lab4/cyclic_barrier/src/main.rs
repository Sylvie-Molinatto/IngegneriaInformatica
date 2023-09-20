use std::{sync::Arc, time::Duration};

use cyclic_barrier::barrier::CyclicBarrier;

fn main() {
    let abarrier = Arc::new(CyclicBarrier::new(3));
    
    let mut vt = Vec::new();
    
    for i in 0..3 {
        let cbarrier = abarrier.clone();
        vt.push(std::thread::spawn(move || {
            for j in 0..10 {
                cbarrier.wait();
                println!("after barrier {} {}\n", i, j);
            }
        }));
    }
    
    for t in vt {
        t.join().unwrap();
    }
}