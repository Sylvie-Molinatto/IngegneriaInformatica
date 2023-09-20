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


fn capitalize(s: &str) -> String {

    let mut result : String = String::new();

    let mut first : bool = true;

    for (_i, mut c) in s.char_indices() {

        if first==true && c!=' '{
            let vec_upper: Vec<char> = c.to_uppercase().collect();
            c = vec_upper[0];
            // c.make_ascii_uppercase(); questo metodo non converte le lettere accentate
            first = false;
        }

        else if c== ' '{
            first=true;
        }

        result.push(c);
    }
return result;

}

fn main() {
    let args = Args::parse();
    for _ in 0..args.count {
        //println!("Hello {}!", args.s);
        println!("{}", capitalize(&args.s));
    }
}

