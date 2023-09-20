use std::env;
use std::thread;
use std::sync::{Arc, Mutex};
use std::time::Instant;
use rand::Rng;

fn main() {
    // Leggi gli argomenti da riga di comando
    let args: Vec<String> = env::args().collect();

    // Verifica se sono stati forniti gli argomenti corretti
    if args.len() != 6 {
        println!("Usage: rust-puzzle <num1> <num2> <num3> <num4> <num5>");
        return;
    }

    // Converte gli argomenti in numeri interi
    let numbers: Vec<i32> = args[1..].iter().map(|arg| arg.parse().unwrap()).collect();

    // Genera tutte le possibili permutazioni delle cifre
    let permutations = generate_permutations(&numbers);

    // Numero di thread da utilizzare
    let num_threads = 4;

    // Misurazione dei tempi di esecuzione
    let mut durations: Vec<_> = Vec::new();

    // Prova con diverse configurazioni di thread
    for threads in 2..=num_threads {
        let start = Instant::now();
        let solutions = find_solutions_parallel(&permutations, &numbers, threads);
        let duration = start.elapsed();

        durations.push(duration);

        // Stampa le soluzioni trovate
        for solution in solutions {
            println!("{}", solution);
        }
        println!("---");
    }

    // Stampa i tempi di esecuzione
    for (i, duration) in durations.iter().enumerate() {
        println!("Threads: {}, Duration: {:?}", i + 2, duration);
    }
}

// Funzione per generare tutte le permutazioni delle cifre
fn generate_permutations(numbers: &[i32]) -> Vec<Vec<i32>> {
    let mut permutations = Vec::new();
    generate_permutations_recursive(&mut permutations, &mut Vec::new(), numbers);
    permutations
}

fn generate_permutations_recursive(permutations: &mut Vec<Vec<i32>>, current: &mut Vec<i32>, numbers: &[i32]) {
    if current.len() == numbers.len() {
        permutations.push(current.clone());
        return;
    }

    for num in numbers {
        current.push(*num);
        generate_permutations_recursive(permutations, current, numbers);
        current.pop();
    }
}

// Funzione per trovare le soluzioni in modo parallelo
fn find_solutions_parallel(permutations: &[Vec<i32>], numbers: &[i32], num_threads: usize) -> Vec<String> {
    let permutation_blocks = divide_permutations(permutations, num_threads);

    let solutions: Arc<Mutex<Vec<String>>> = Arc::new(Mutex::new(Vec::new()));
    let mut handles = vec![];

    for block in permutation_blocks {
        let solutions_shared = Arc::clone(&solutions);
        let numbers_clone = numbers.to_vec();
        let handle = thread::spawn(move || {
            find_solutions(&block, &numbers_clone, &solutions_shared);
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    let solutions = solutions.lock().unwrap();
    solutions.clone()
}

// Funzione per dividere le permutazioni tra i thread
fn divide_permutations(permutations: &[Vec<i32>], num_threads: usize) -> Vec<Vec<Vec<i32>>> {
    let block_size = (permutations.len() as f64 / num_threads as f64).ceil() as usize;
    permutations.chunks(block_size).map(|chunk| chunk.to_vec()).collect()
}

// Funzione per trovare le soluzioni date un blocco di permutazioni
fn find_solutions(block: &[Vec<i32>], numbers: &[i32], solutions: &Arc<Mutex<Vec<String>>>) {
    for permutation in block {
        let mut expression = String::new();
        let mut result = permutation[0] as f64;

        expression.push_str(&permutation[0].to_string());

        for i in 1..permutation.len() {
            let operator = get_random_operator();
            let num = permutation[i];

            expression.push_str(&format!(" {} {}", operator, num));

            match operator {
                '+' => result += num as f64,
                '-' => result -= num as f64,
                'x' => result *= num as f64,
                '/' => result /= num as f64,
                _ => panic!("Invalid operator"),
            }
        }

        if (result - 10.0).abs() < std::f64::EPSILON {
            let mut solutions = solutions.lock().unwrap();
            solutions.push(expression);
        }
    }
}

// Funzione per ottenere un operatore casuale tra +, -, x, /
fn get_random_operator() -> char {
    let operators = ['+', '-', 'x', '/'];
    let random_index = rand::random::<usize>() % operators.len();
    operators[random_index]
}
