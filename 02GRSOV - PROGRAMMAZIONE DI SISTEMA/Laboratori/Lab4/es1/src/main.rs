use std::env;

fn main() {
    // Leggi gli argomenti da riga di comando
    //let args: Vec<String> = env::args().collect();

    // Verifica se sono stati forniti gli argomenti corretti
    //if args.len() != 6 {
    //    println!("Usage: rust-puzzle <num1> <num2> <num3> <num4> <num5>");
    //    return;
    //}

    let mut vec: Vec<String> = vec![];

    // Aggiungi elementi al vettore
    vec.push(String::from("1"));
    vec.push(String::from("2"));
    vec.push(String::from("3"));
    vec.push(String::from("4"));
    vec.push(String::from("5"));



    // Converte gli argomenti in numeri interi
    let numbers: Vec<i32> = vec[1..].iter().map(|arg| arg.parse().unwrap()).collect();

    // Genera tutte le possibili permutazioni delle cifre
    let permutations = generate_permutations(&numbers);

    // Genera tutte le possibili permutazioni delle operazioni
    let operations = generate_operations();

    // Vettore per salvare le soluzioni
    let mut solutions: Vec<String> = Vec::new();

    // Prova tutte le combinazioni di permutazioni delle cifre e delle operazioni
    for permutation in permutations {
        for operation in &operations {
            let result = evaluate_expression(&permutation, &operation);
            if result == 10 {
                let solution = format_solution(&permutation, &operation);
                solutions.push(solution);
            }
        }
    }

    // Stampa le soluzioni trovate
    for solution in solutions {
        println!("{}", solution);
    }
}

// Funzione per generare tutte le permutazioni delle cifre
fn generate_permutations(numbers: &[i32]) -> Vec<Vec<i32>> {
    let mut permutations: Vec<Vec<i32>> = Vec::new();
    permute(numbers, 0, &mut permutations);
    permutations
}

fn permute(numbers: &[i32], start: usize, permutations: &mut Vec<Vec<i32>>) {
    if start == numbers.len() {
        permutations.push(numbers.to_vec());
    } else {
        for i in start..numbers.len() {
            let mut numbers = numbers.to_vec();
            numbers.swap(start, i);
            permute(&numbers, start + 1, permutations);
        }
    }
}

// Funzione per generare tutte le possibili permutazioni delle operazioni
fn generate_operations() -> Vec<Vec<char>> {
    let operations = ['+', '-', '*', '/'];
    let mut result: Vec<Vec<char>> = Vec::new();
    generate_operation_permutations(&operations, &mut Vec::new(), &mut result);
    result
}

fn generate_operation_permutations(
    operations: &[char],
    current: &mut Vec<char>,
    result: &mut Vec<Vec<char>>,
) {
    if current.len() == 4 {
        result.push(current.to_vec());
    } else {
        for &operation in operations {
            current.push(operation);
            generate_operation_permutations(operations, current, result);
            current.pop();
        }
    }
}

// Funzione per valutare l'espressione data una permutazione delle cifre e delle operazioni
fn evaluate_expression(numbers: &[i32], operations: &[char]) -> i32 {
    let mut result = numbers[0];
    for i in 0..operations.len() {
        match operations[i] {
            '+' => result += numbers[i + 1],
            '-' => result -= numbers[i + 1],
            '*' => result *= numbers[i + 1],
            '/' => result /= numbers[i + 1],
            _ => panic!("Invalid operation"),
        }
    }
    result
}

// Funzione per formattare la soluzione come una stringa leggibile
fn format_solution(numbers: &[i32], operations: &[char]) -> String {
    let mut solution = String::new();
    for i in 0..numbers.len() - 1 {
        solution.push_str(&numbers[i].to_string());
        solution.push(' ');
        solution.push(operations[i]);
        solution.push(' ');
    }
    solution.push_str(&numbers[numbers.len() - 1].to_string());
    solution
}
