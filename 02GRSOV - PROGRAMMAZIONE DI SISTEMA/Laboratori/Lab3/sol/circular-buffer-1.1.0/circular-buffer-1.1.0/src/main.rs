use circular_buffer::{CircularBuffer, Error};

fn main() {
    let mut buffer = CircularBuffer::new(1);
    assert!(buffer.write('1').is_ok());
    assert_eq!(Ok('1'), buffer.read());
    assert_eq!(Err(Error::EmptyBuffer), buffer.read());
}