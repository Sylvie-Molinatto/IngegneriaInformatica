use clap::Parser;
/// Simple program to insert strings
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// String
    #[arg(short, long)]
    s: String,

    /// String number
    #[arg(short, long, default_value_t = 1)]
    count: u8,
}
/// Check a Luhn checksum.
pub fn is_valid(code: &str) -> bool {
    let mut result : bool =false;

    if code.trim().len()<=1{
        return result;
    }
    else{

        // check if there are alphabetic chars
        for (_i, c) in code.char_indices() {
            if c.is_alphabetic(){
                result=false;
                return result;
            }
        }
        // delete spaces
        let code = code.replace(" ","");
        let mut total : u32 = 0;
        // double
        for (i,c) in code.chars().rev().enumerate(){
            match c.to_digit(10) {
                Some(mut val) => {
                    if i % 2 == 0 {
                        total += val;
                    } else {
                        val *= 2;
                        if val > 9 { val -= 9 };
                        total += val;
                    }
                }
                None => { result=false; }
            }
        }
        if  total%10 == 0{
            //println!("Result : {}",total);
            result=true;
        }

        return result;
    }
}

pub fn main(){

    let mut valid: bool = true;
    let args = Args::parse();
    let code : &str = &args.s;

    let _v : Vec<&str> = code.split(" ").collect();

    if _v.len()==4{
        for str in _v {
            if str.len()==4{
                for (_i, c) in str.char_indices() {
                    if c.is_alphabetic() {
                        valid=false;
                    }
                }
            }
            else {
                valid = false;
            }
        }
    }
    else{
        valid=false;
    }

    if valid==true{
        if (is_valid(code))==true{
            println!("Valid code");
        }
        else{
            println!("Invalid code");
        }
    }
    else{
        println!("Invalid format");
    }


}
