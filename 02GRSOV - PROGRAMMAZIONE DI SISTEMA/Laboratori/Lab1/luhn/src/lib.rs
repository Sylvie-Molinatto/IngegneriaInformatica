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
