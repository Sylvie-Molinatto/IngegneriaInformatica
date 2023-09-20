use std::sync::Arc;

use barrier::{cb, cbv};
use rand;

fn barrier_example() {

    let abarrrier = Arc::new(cb::CyclicBarrier::new(3));

    let mut vt = Vec::new();

    for i in 0..3 {
        let cbarrier = abarrrier.clone();

        vt.push(std::thread::spawn(move || {
            for j in 0..10 {
                cbarrier.wait();
                println!("barrier open {} {}", i, j);
            }
        }));
    }

    for t in vt {
        t.join().unwrap();
    }
}

fn sense() -> u32 {
    let r: f32 = rand::random();
    let t: f32 = rand::random();
    std::thread::sleep_ms((1000.0 * t).floor() as u32);
    (100.0 * r).floor() as u32
}

fn writer() {
    std::thread::sleep_ms(1000);
} 

fn val_barrier_example() {
    let mut sensort = Vec::new();
    let vbarrier = Arc::new(cbv::CyclicBarrierWithVal::new(10));
    for i in 0..10 {
        let vbarrier = vbarrier.clone();
            sensort.push(std::thread::spawn(move || {
                // uncomment c and pass c to the barrier to test it; you should see all 1s, 2s, and so on
                //let mut c = 0;
                loop {
                    //c += 1;
                    let val = sense();
                    // vbarrier.wait((i, c));
                    vbarrier.wait((i, val));
                }
            }
        ));
    }

    let vbarrier1 = vbarrier.clone();
    let h = std::thread::spawn(move || {
        loop {
            let vals = vbarrier1.wait_for_vals();
            println!("vals: {:?}", vals);
            writer();
            vbarrier1.open();
        }
    });

    h.join().unwrap();
}

fn main() {
    //barrier_example();
    val_barrier_example();
}
