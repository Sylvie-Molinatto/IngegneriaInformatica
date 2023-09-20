pub struct CircularBuffer<T> {
    // We fake using T here, so the compiler does not complain that
    // "parameter `T` is never used". Delete when no longer needed.
    buf: Vec<Option<T>>,
    head: usize,
    length: usize,
}

#[derive(Debug, PartialEq, Eq)]
pub enum Error {
    EmptyBuffer,
    FullBuffer,
}

impl<T:Clone> CircularBuffer<T> {
    pub fn new(capacity: usize) -> Self {
        Self {buf:vec![None; capacity], head: 0, length: 0}
    }

    pub fn write(&mut self, _element: T) -> Result<(), Error> {
        if self.length < self.buf.capacity() {
            let next = (self.head + self.length) % self.buf.capacity();
            self.buf[next] = Some(_element);
            self.length += 1;
            Ok(())
        } else {
            Err(Error::FullBuffer)
        }
    }

    pub fn read(&mut self) -> Result<T, Error> {
        if self.length > 0 {
            let result = self.buf[self.head].take();
            self.head = (self.head + 1) % self.buf.capacity();
            self.length -= 1;
            Ok(result.unwrap())
        } else {
            Err(Error::EmptyBuffer)
        }
    }

    pub fn clear(&mut self) {
        for _ in 0..self.length {
            self.read().unwrap();
        }
    }

    pub fn overwrite(&mut self, element: T) {
        if self.length == self.buf.capacity() {
            self.read().unwrap();
        }

        self.write(element).unwrap();
    }
}
