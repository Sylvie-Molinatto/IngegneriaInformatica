use clap::Parser;
use std::fs::File;
use std::io::{Read, Result};
use std::convert::TryInto;
use std::fmt::{Debug, Formatter};

#[derive(Parser,Default, Debug)]
struct Args {
    /// Name of the person to greet
    name: String
}

#[repr(C)]
#[derive(Debug, Copy, Clone)]
struct ValueStruct {
    t: i32,
    val: f32,
    timestamp: i32,
}

#[repr(C)]
#[derive(Debug, Copy, Clone)]
struct MValueStruct {
    t: i32,
    val: [f32; 10],
    timestamp: i32,
}

#[repr(C)]
#[derive(Debug, Copy, Clone)]
struct MessageStruct {
    t: i32,
    message: [u8; 21],
}

union ExportData{
    val: ValueStruct,
    mvals: MValueStruct,
    messages: MessageStruct
}

struct CData{
    t: i32,
    data: ExportData
}

impl Debug for CData {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self.t {
            1 => {
                unsafe {write!(f, "{} ValueStruct [{} {}]\n", 1, self.data.val.val, self.data.val.timestamp)}
            },
            2 => {
                unsafe {write!(f, "{} MValueStruct [ {:?} {}]\n", 2, self.data.mvals.val, self.data.mvals.timestamp)}
            },
            3 => {
                unsafe {write!(f, "{} MessageStruct [{}]\n", 3, std::str::from_utf8(&self.data.messages.message).unwrap())}
            },
            _ => Ok(())
        }
    }
}

impl CData{
    fn from_file(mut file: File) -> Result<CData>{

        let mut buf = [0u8; 52];
        file.read_exact(&mut buf)?;

        let mut cdata = CData{t:0, data: ExportData{val: ValueStruct{
            t: 0,
            val: 0.0,
            timestamp: 0,
        }}};

        cdata.t = i32::from_le_bytes(buf[0..4].try_into().unwrap());

        match cdata.t {
            1 => {
                let val_struct = ValueStruct {
                    t: i32::from_le_bytes(buf[4..8].try_into().unwrap()),
                    val: f32::from_le_bytes(buf[8..12].try_into().unwrap()),
                    timestamp: i32::from_le_bytes(buf[12..16].try_into().unwrap()),
                };
                cdata.data = ExportData{val: val_struct};
            },
            2 => {
                let mut val = [0.0f32; 10];
                for i in 0..10 {
                    val[i] = f32::from_le_bytes(buf[8+(4*i)..12+(4*i)].try_into().unwrap());
                }

                let mvals_struct = MValueStruct{
                    t: i32::from_le_bytes(buf[4..8].try_into().unwrap()),
                    val,
                    timestamp: i32::from_le_bytes(buf[48..52].try_into().unwrap()),
                };
                cdata.data = ExportData{mvals: mvals_struct};
            },
            3 => {
                let mut message = [0u8; 21];
                for i in 0..21{
                    message[i] = u8::from_le_bytes([buf[8+i]])
                }

                let messages_struct = MessageStruct{
                    t: i32::from_le_bytes(buf[4..8].try_into().unwrap()),
                    message
                };
                cdata.data = ExportData{messages: messages_struct};
            },
            _ => {}
        }
        Ok(cdata)
    }
}

fn main() {
    let args = Args::parse();
    let file = File::open(args.name).unwrap();
    //comando: cargo run -- ../data.dat
    let mut data = Vec::with_capacity(100);
    for _i in 0..100 {
        let cdata = CData::from_file(file.try_clone().unwrap()).unwrap();
        data.push(cdata);
    }
    println!("{:?}", data);
}
