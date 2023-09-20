use std::marker::PhantomData;
use std::mem;

pub struct CircularBuffer<T> {
    // This field is here to make the template compile and not to
    // complain about unused type parameter 'T'. Once you start
    // solving the exercise, delete this field and the 'std::marker::PhantomData'
    // import.
    data: Vec<T>,
    wpos: usize,
    rpos: usize,
    len: usize
}

#[derive(Debug, PartialEq)]
pub enum Error {
    EmptyBuffer,
    FullBuffer,
}

impl<T: Default> CircularBuffer<T> {
    pub fn new(capacity: usize) -> Self {
        let mut buf = Vec::with_capacity(capacity);
        for _ in 0..capacity { buf.push(T::default()); }
        CircularBuffer{
            data: buf,
            wpos: 0,
            rpos: 0,
            len: 0
        }
        
    }

    pub fn write(&mut self, _element: T) -> Result<(), Error> {
        if self.len == self.data.len() {
            return Err(Error::FullBuffer);
        } else {
            self.data[self.wpos] = _element;
            self.wpos = (self.wpos + 1) % self.data.len();
            self.len+=1;
            return Ok(());
        }
    }

    pub fn read(&mut self) -> Result<T, Error> {
        if self.len == 0 {
            return Err(Error::EmptyBuffer);
        } else {
            let element = mem::take(&mut self.data[self.rpos]);
            self.rpos = (self.rpos + 1) % self.data.len();
            self.len -= 1;
            return Ok(element);
        }
    }

    pub fn clear(&mut self) {
        while self.len > 0 {
            self.read().unwrap();
        }
    }

    pub fn overwrite(&mut self, _element: T) {
        if self.len == self.data.len() {
            self.read().unwrap();
        } 
        self.write(_element);
    }
}
