fn count_around(i: usize, j: usize, board: &[&str]) -> char {
    let mut total = 0;
    let imin = if i > 0 { i - 1 } else { i };
    let jmin = if j > 0 { j - 1 } else { j };
    for x in imin..(i + 2) {
        for y in jmin..(j + 2) {
            if let Some(row) = board.get(x) {
                if let Some('*') = row.chars().nth(y) {
                    total += 1;
                }
            }
        }
    }
    match total {
        0 => ' ',
        x => std::char::from_digit(x, 10).unwrap()
    }
}
pub fn annotate(board: &[&str]) -> Vec<String> {
    let mut out = Vec::with_capacity(board.len());
    for i in 0..board.len() {
        out.push(String::with_capacity(board[i].len()));
        for (j, c) in board[i].chars().enumerate() {
            out[i].push(match c {
                '*' => '*',
                _ => count_around(i, j, board),
            });
        }
    }
    out
}

fn main() {

    let input : &[&str] = &[
        "·*·*·",
        "··*··",
        "··*··",
        "·····",
    ];

    let result : Vec<String> = annotate(input);

    for s in result {
        println!("{}",s);
    }
}
