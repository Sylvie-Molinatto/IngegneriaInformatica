
pub mod cb {
    use std::sync::{Condvar, Mutex};
    
    #[derive(Debug)]
    enum State {
        Entering(usize),
        Exiting(usize),
    }

    fn is_entering(state: &State) -> bool {
        match state {
            State::Entering(_) => true,
            _ => false,
        }
    }

    pub struct CyclicBarrier {
        size: usize,
        mutex: Mutex<State>,
        cond: Condvar,
    }

    impl CyclicBarrier {
        pub fn new(n: usize) -> Self {
            CyclicBarrier {
                size: n,
                mutex: Mutex::new(State::Entering(0)),
                cond: Condvar::new(),
            }
        }


        pub fn wait(&self) {
            let mut state = self.mutex.lock().unwrap();
            state = self.cond.wait_while(state, |s| !is_entering(s)).unwrap();

            // we are entering
            if let State::Entering(n) = *state {
                if n == self.size - 1 {
                    *state = State::Exiting(self.size-1);
                    self.cond.notify_all();
                } else {
                    *state = State::Entering(n + 1);
                    state = self.cond.wait_while(state, |s| is_entering(s)).unwrap();
                    if let State::Exiting(n) = *state {
                        if n == 1 {
                            // the last one set state to entering
                            *state = State::Entering(0);
                            self.cond.notify_all();
                        } else {
                            *state = State::Exiting(n - 1);
                        }
                    } else {
                        panic!("unexpected state");
                    };
                }
            } else {
                panic!("unexpected state");
            }
        }
    }
}


pub mod cbv {
    use std::sync::{Condvar, Mutex};
    
    enum Status {
        Recording, Setting
    }

    struct State<T> {
        status: Status,
        vals: Vec<(u32, T)>        
    }


    pub struct CyclicBarrierWithVal<T>
    where T: Clone {
        size: usize,
        mutex: Mutex<State<T>>,
        cond: Condvar,
    }

    impl<T: Clone> CyclicBarrierWithVal<T> {
        pub fn new(n: usize) -> Self {
            CyclicBarrierWithVal {
                size: n,
                mutex: Mutex::new(State { status: Status::Recording, vals: Vec::new() }),
                cond: Condvar::new(),
            }
        }

        fn is_recording(s: &State<T>) -> bool {
            match s.status {
                Status::Recording => true,
                _ => false,
            }
        }

        pub fn wait(&self, val: (u32, T))  {
            let mut state = self.mutex.lock().unwrap();
            state.vals.push(val);

            if state.vals.len() == self.size {
                state.status = Status::Setting;
                self.cond.notify_all();
            } else {
                // wait until all threads are recording
                state = self.cond.wait_while(state, |s| Self::is_recording(s)).unwrap();
            }
            
            // wait for setting
            let _unused = self.cond.wait_while(state, |s| !Self::is_recording(s)).unwrap();
        }

        pub fn wait_for_vals(&self) -> Vec<(u32, T)> {
            // wait for all threads to enter and return the vals
            let mut state = self.mutex.lock().unwrap();
            state = self.cond.wait_while(state, |s| Self::is_recording(s)).unwrap();
            let vals = std::mem::replace(&mut (*state).vals, Vec::new());
            vals            
        }

        pub fn open(&self) {
            let mut state = self.mutex.lock().unwrap();
            state.status = Status::Recording;
            self.cond.notify_all();            
        }
    }
}