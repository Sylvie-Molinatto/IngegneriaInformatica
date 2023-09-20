use core::fmt::Debug;
use core::fmt::Display;
use std::collections::HashSet;
use std::collections::HashMap;

/// `InputCellId` is a unique identifier for an input cell.
#[derive(Clone, Copy, Debug, PartialEq, Hash, Eq)]
pub struct InputCellId(usize);
/// `ComputeCellId` is a unique identifier for a compute cell.
/// Values of type `InputCellId` and `ComputeCellId` should not be mutually assignable,
/// demonstrated by the following tests:
///
/// ```compile_fail
/// let mut r = react::Reactor::new();
/// let input: react::ComputeCellId = r.create_input(111);
/// ```
///
/// ```compile_fail
/// let mut r = react::Reactor::new();
/// let input = r.create_input(111);
/// let compute: react::InputCellId = r.create_compute(&[react::CellId::Input(input)], |_| 222).unwrap();
/// ```
#[derive(Clone, Copy, Debug, PartialEq, Hash, Eq)]
pub struct ComputeCellId(usize);

#[derive(Clone, Copy, Debug, PartialEq, Hash, Eq)]
pub struct CallbackId(usize);

#[derive(Clone, Copy, Debug, PartialEq, Hash, Eq)]
pub enum CellId {
    Input(InputCellId),
    Compute(ComputeCellId),
}

#[derive(Debug, PartialEq)]
pub enum RemoveCallbackError {
    NonexistentCell,
    NonexistentCallback,
}

struct ComputeCell<'a, T> {
    val: Option<T>,
    deps: Vec<CellId>,
    fun: Box<dyn Fn(&[T]) -> T + 'a>,
    callbacks: HashMap<CallbackId, Box<dyn FnMut(T) + 'a>>
}

pub struct Reactor<'a, T> {
    // Just so that the compiler doesn't complain about an unused type parameter.
    // You probably want to delete this field.
    inputs: Vec<T>,
    cells: Vec<ComputeCell<'a, T>>,
    inv_deps: HashMap<CellId, HashSet<ComputeCellId>>, // cellid -> dep to compute only dirty cells
    cbcells: HashMap<CallbackId, ComputeCellId>,
    cb_ids: usize
}

// You are guaranteed that Reactor will only be tested against types that are Copy + PartialEq.
impl<'a, T: Copy + PartialEq + Display + Debug> Reactor<'a, T,> {
    pub fn new() -> Self {
        Reactor::<T> {
            inputs: Vec::new(),
            cells: Vec::new(),
            inv_deps: HashMap::new(),
            cbcells: HashMap::new(),
            cb_ids: 0
        }
    }

    // Creates an input cell with the specified initial value, returning its ID.
    pub fn create_input(&mut self, _initial: T) -> InputCellId {
        let cell_id =  InputCellId(self.inputs.len());
        self.inputs.push(_initial);
        cell_id
    }

    // Creates a compute cell with the specified dependencies and compute function.
    // The compute function is expected to take in its arguments in the same order as specified in
    // `dependencies`.
    // You do not need to reject compute functions that expect more arguments than there are
    // dependencies (how would you check for this, anyway?).
    //
    // If any dependency doesn't exist, returns an Err with that nonexistent dependency.
    // (If multiple dependencies do not exist, exactly which one is returned is not defined and
    // will not be tested)
    //
    // Notice that there is no way to *remove* a cell.
    // This means that you may assume, without checking, that if the dependencies exist at creation
    // time they will continue to exist as long as the Reactor exists.
    pub fn create_compute<F: 'a + Fn(&[T]) -> T>(
        &mut self,
        _dependencies: &[CellId],
        _compute_func: F ,
    ) -> Result<ComputeCellId, CellId> {
        let cell_id = ComputeCellId(self.cells.len());
        for &dep in _dependencies {
            match dep {
                CellId::Input(id) if id.0 >= self.inputs.len() => {return Err(CellId::Input(id));}
                CellId::Compute(id) if id.0 >= self.cells.len() => {return Err(CellId::Compute(id));}
                _ => {}
            }
        }
        let deps = _dependencies.to_vec();
        let cell = ComputeCell {
            val: None,
            deps: deps,
            fun: Box::new(_compute_func),
            callbacks: HashMap::new()
        };

        self.cells.push(cell);
        
        // and inverted deps
        for &dep in _dependencies {
            self.inv_deps.entry(dep).or_insert(HashSet::new()).insert(cell_id);
        }

        self.compute(&cell_id);

        Ok(cell_id)
    }

    // Retrieves the current value of the cell, or None if the cell does not exist.
    //
    // You may wonder whether it is possible to implement `get(&self, id: CellId) -> Option<&Cell>`
    // and have a `value(&self)` method on `Cell`.
    //
    // It turns out this introduces a significant amount of extra complexity to this exercise.
    // We chose not to cover this here, since this exercise is probably enough work as-is.
    pub fn value(&self, id: CellId) -> Option<T> {
        match id {
            CellId::Input(cell) if cell.0 < self.inputs.len() => Some(self.inputs[cell.0]),
            CellId::Compute(cell) if cell.0 < self.cells.len() => self.cells[cell.0].val,
            _=> None
        }
    }

    // Sets the value of the specified input cell.
    //
    // Returns false if the cell does not exist.
    //
    // Similarly, you may wonder about `get_mut(&mut self, id: CellId) -> Option<&mut Cell>`, with
    // a `set_value(&mut self, new_value: T)` method on `Cell`.
    //
    // As before, that turned out to add too much extra complexity.
    pub fn set_value(&mut self, _id: InputCellId, _new_value: T) -> bool {
        if self.inputs.len() <= _id.0 {
            return false
        };
        self.inputs[_id.0] = _new_value;

        let mut dirty: Vec<CellId> = vec![CellId::Input(_id)];

        while !dirty.is_empty() {
            let cur = dirty.pop().unwrap();

            let deps = self.inv_deps.get(&cur).cloned();  // must be cloned in order to release ownership of self
            
            if let Some(_deps) = deps {
                for cellid in _deps.iter() {
                    self.compute(&cellid);
                    dirty.push(CellId::Compute(*cellid))
                }
            }
        }

        return true;

    }

    fn compute(&mut self, cellid: &ComputeCellId)  {

        // per leggere solo gli args è meglio un borrow immutabile
        let cell = &self.cells[cellid.0];
        let args = cell.deps.iter().map(|x| {
            match x {
                CellId::Input(_id) => self.inputs[_id.0],
                CellId::Compute(_id) => self.cells[_id.0].val.unwrap()
            }
        }).collect::<Vec<T>>();
        
        // dobbiamo prendere un nuovo refrence come mutable
        let cell = &mut self.cells[cellid.0];
        let new_val = (*cell.fun)(&args);
        let changed = match cell.val {
            None => true,
            Some(x) => x != new_val
        };

        if changed {
            cell.val = Some(new_val);
            for (_, cb) in cell.callbacks.iter_mut() {
                (*cb)(new_val);
            }
        }
    }

    // Adds a callback to the specified compute cell.
    //
    // Returns the ID of the just-added callback, or None if the cell doesn't exist.
    //
    // Callbacks on input cells will not be tested.
    //
    // The semantics of callbacks (as will be tested):
    // For a single set_value call, each compute cell's callbacks should each be called:
    // * Zero times if the compute cell's value did not change as a result of the set_value call.
    // * Exactly once if the compute cell's value changed as a result of the set_value call.
    //   The value passed to the callback should be the final value of the compute cell after the
    //   set_value call.
    pub fn add_callback<F: FnMut(T) + 'a>(
        &mut self,
        _id: ComputeCellId,
        _callback: F,
    ) -> Option<CallbackId> {
        if _id.0 >= self.cells.len() {
            return None
        }
        let cell = &mut self.cells[_id.0];
        let callback_id = CallbackId(self.cb_ids);
        self.cb_ids += 1;
        cell.callbacks.insert(callback_id, Box::new(_callback));
        self.cbcells.insert(callback_id,_id);        

        Some(callback_id)
    }

    // Removes the specified callback, using an ID returned from add_callback.
    //
    // Returns an Err if either the cell or callback does not exist.
    //
    // A removed callback should no longer be called.
    pub fn remove_callback(
        &mut self,
        cell: ComputeCellId,
        callback: CallbackId,
    ) -> Result<(), RemoveCallbackError> {
        if cell.0 >= self.cells.len() {
            return Err(RemoveCallbackError::NonexistentCell);
        }
        match self.cbcells.get(&callback) {
            None => Err(RemoveCallbackError::NonexistentCallback),
            Some(cellid) => {
                self.cells[cellid.0].callbacks.remove(&callback);
                self.cbcells.remove(&callback);
                Ok(())
            }
        }
    }
}
