use std::collections::HashMap;

pub fn frequency(input: &[&'static str], worker_count: usize) -> HashMap<char, usize> {
    
    // SOLUTION WITH THREADS

    let mut map: HashMap<char, usize> = HashMap::new(); // mappa delle lettere dell'alfabeto

    if input.len()==0{
        return map;
    }

    let mut workers = vec![]; // threads

    for i in 0..worker_count{ 
        
        // calcolo per ogni thread il chunk di cui deve calcolare il numero di lettere
        let start = i*input.len()/worker_count;

        let end = if i<worker_count-1 {
            (i+1)*input.len()/worker_count
        }
        else{
            input.len()
        };


        let mut chunk = vec![];
        for i in start..end{
            chunk.push(input[i]);
        }

        // creo un thread e gli assegno il chunk
        workers.push(std::thread::spawn(move || {
            let mut hm : HashMap<char, usize> = HashMap::new();
    
            for ch in chunk{
                for c in ch.chars(){
                    if c.is_alphabetic(){
                        let cl = c.to_lowercase().next().unwrap();
                        *hm.entry(cl).or_insert(0)+=1;
                    }
                }
            }
            hm
        }));
    }

    for worker in workers{
        let n = worker.join().unwrap();
        for (k,v) in n{
            *map.entry(k).or_insert(0)+=v;
        }

    }

    map

    // SOLUTION WITHOUT THREADS

    /* 
    let mut map = HashMap::new();
    
    for &s in input{
        for mut c in s.chars(){
            if c.is_alphabetic(){
                c = c.to_ascii_lowercase();
                *map.entry(c).or_default()+=1;
            }
        }
    }
    map

    */
}
