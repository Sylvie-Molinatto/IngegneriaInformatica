pub mod barrier{
    use std::sync::{Condvar, Mutex};

    #[derive(Debug)]
    pub enum State{
        Entering(usize),
        Exiting(usize),
    }

    fn is_entering(state: &State) -> bool{
        match state{
            State::Entering(_) => true,
            State::Exiting(_) => false
        }
    }

    pub struct CyclicBarrier{
        num_threads : usize,
        mutex: Mutex<State>,
        cvar : Condvar
    }

    impl CyclicBarrier {
        pub fn new (num_threads: usize) -> Self {
            CyclicBarrier { 
                num_threads: num_threads,
                mutex: Mutex::new(State::Entering(0)),
                cvar : Condvar::new(),
            }
        }

        pub fn wait (&self){
            let mut state = self.mutex.lock().unwrap();
            state = self.cvar.wait_while(state, |s| !is_entering(s)).unwrap();

            if let State::Entering(n) = *state {
                if n == self.num_threads - 1 {
                    *state = State::Exiting(self.num_threads-1);
                    self.cvar.notify_all();
                }
                else{
                    *state = State::Entering(n+1);
                    state = self.cvar.wait_while(state, |s| is_entering(s)).unwrap();
                    if let State::Exiting(n) = *state{
                        if n==1{
                            *state = State::Entering(0);
                            self.cvar.notify_all();
                        }
                        else{
                            *state = State::Exiting(n-1);
                        }
                    }
                    else{
                        panic!("unexpected state")
                    };
                }
            }
            else{
                panic!("unexpected state")
            }        
        }
    }
}