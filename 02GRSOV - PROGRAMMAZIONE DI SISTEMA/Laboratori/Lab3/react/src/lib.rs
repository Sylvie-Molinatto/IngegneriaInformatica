use std::collections::{HashMap, HashSet, VecDeque};
use std::fmt::{Debug, Formatter};
use std::io;
use std::io::{ErrorKind, Write};
use std::ops::{Add, Deref, DerefMut};
use crate::CellId::Compute;
/// `InputCellId` is a unique identifier for an input cell.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
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
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
pub struct ComputeCellId(usize);
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
pub struct CallbackId(usize);
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
pub enum CellId {
    Input(InputCellId),
    Compute(ComputeCellId),
}
impl CellId{
    pub fn get_input_cell(cell_id: &CellId) -> Option<&InputCellId> {
        match cell_id {
            CellId::Input(c) => Some(c),
            CellId::Compute(_) => None
        }
    }
    pub fn get_compute_cell(cell_id: &CellId) -> Option<&ComputeCellId> {
        match cell_id {
            CellId::Compute(c) => Some(c),
            CellId::Input(_) => None
        }
    }
}
#[derive(Debug, PartialEq, Eq)]
pub enum RemoveCallbackError {
    NonexistentCell,
    NonexistentCallback,
}
struct ComputeCell<'a, T> {
    val: Option<T>,
    deps: Vec<CellId>,  //Il nuovo computeCell è aggiornato da questa lista di In/Com
    fun: Box<dyn Fn(&[T]) -> T + 'a>,
    callbacks: HashMap<CallbackId, Box<dyn FnMut(T) + 'a>>
}
// è tipo la classe base che conterrà tutto ?
pub struct Reactor<'a, T> {
    inputs: Vec<T>,
    cells: Vec<ComputeCell<'a,T>>,
    inv_deps: HashMap<CellId, HashSet<ComputeCellId>>,//CellID aggiorna l'insieme nell'hashset
    cbcells: HashMap<CallbackId, ComputeCellId>,
    cb_ids: usize
}
/*impl<'a,T: Copy + PartialEq + Debug> Debug for Reactor<'a,T>{
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        let mut s = String::new();
        for c in self.cells.iter(){
            s.push_str(format!("{:?}",c.val.unwrap()).as_str());
            s.push_str("\n");
        }
        write!(f,"{}",s)
    }
}*/
// You are guaranteed that Reactor will only be tested against types that are Copy + PartialEq.
impl<'a,T: Copy + PartialEq + Debug> Reactor<'a,T> {
    pub fn new() -> Self {
        Reactor{
            inputs: vec![],
            cells: vec![],
            inv_deps: Default::default(),
            cbcells: Default::default(),
            cb_ids: 0,  // callbacks' id.
        }
    }
    // Creates an input cell with the specified initial value, returning its ID.
    pub fn create_input(&mut self, _initial: T) -> InputCellId {
        let id = self.inputs.len();
        self.inputs.push(_initial);
        //inv_deps is the list of ComputeCells which depends on this new input
        self.inv_deps.insert(CellId::Input(InputCellId(id)),HashSet::new());
        InputCellId(id)
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
    pub fn create_compute<F: Fn(&[T]) -> T + 'a>(
        &mut self,
        _dependencies: &[CellId],   //elenco di Input o Compute da cui il nuovo Compute dipende
        _compute_func: F,
    ) -> Result<ComputeCellId, CellId> {
        //check if all the dependences actually exist and push into a vec useful for _compute_func
        let mut vec_cells: Vec<T> = vec![];
        for dep in _dependencies{
            match dep {
                CellId::Input(i) => {
                    if self.inputs.get(i.0).is_none(){
                        return Err(dep.to_owned());
                    }
                    vec_cells.push( self.inputs.get(i.0).unwrap().to_owned());
                },
                CellId::Compute(c) => {
                    if self.cells.get(c.0).is_none() {
                        return Err(dep.to_owned());
                    }
                    vec_cells.push(self.cells.get(c.0).unwrap().val.unwrap().to_owned());
                }
            }
        }
        let val = Some(_compute_func(vec_cells.as_slice()));
        let id = self.cells.len();
        let mut compute_cell = ComputeCell{
            val,
            deps: _dependencies.to_vec(),
            fun: Box::new(_compute_func),
            callbacks: Default::default(),
        };
        self.cells.push(compute_cell);
        self.inv_deps.insert(CellId::Compute(ComputeCellId(id)),HashSet::new());    //at the beginning the new ComputeCell doesn't influence any Cell
        //but the new ComputeCell will depend on
        for d in _dependencies{
            let mut hs = self.inv_deps.get_mut(&d).unwrap();
            hs.insert(ComputeCellId(id));
        }
        Ok(ComputeCellId(id))
    }
    // Retrieves the current value of the cell, or None if the cell does not exist.
    //
    // You may wonder whether it is possible to implement `get(&self, id: CellId) -> Option<&Cell>`
    // and have a `value(&self)` method on `Cell`.
    //
    // It turns out this introduces a significant amount of extra complexity to this exercise.
    // We chose not to cover this here, since this exercise is probably enough work as-is.
    pub fn value(&self, id: CellId) -> Option<T> {
        let mut a =  match id {
            CellId::Input(cell_id) => self.inputs.get(cell_id.0),
            CellId::Compute(compute_id) =>  {
                let res = self.cells.get(compute_id.0);
                if res.is_none(){return None;}
                return res.unwrap().val;
            }
        };
        if a.is_some(){
            return Some(*a.unwrap());
        }
        None
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
        if self.inputs.get(_id.0).is_none(){
            return false;
        }
        self.inputs[_id.0] = _new_value;
        let cellid = CellId::Input(_id);
        let mut callback_value_map : HashMap<CallbackId,T> = HashMap::new();            //useful to trigger callbacks only once
        let mut callback_start_value : HashMap<CallbackId,(CellId,T)> = HashMap::new(); //useful to check if the value AT THE END is changed
        let mut stack = VecDeque::<CellId>::new();
        stack.push_back(cellid);
        while let Some(cid) = stack.pop_back(){
            if let Some(related_cells) = self.inv_deps.get(&cid){
                for &cell in related_cells{
                    stack.push_back(CellId::Compute(cell));
                }
            }
            match cid{
                CellId::Input(_) => continue,
                CellId::Compute(c) => {
                    let dep = self.cells.get(c.0).unwrap();
                    let mut values = Vec::<T>::new();
                    for d in dep.deps.clone(){
                        match d {
                            CellId::Input(i) => values.push(*self.inputs.get(i.0).unwrap()),
                            CellId::Compute(c) => values.push(self.cells.get(c.0).unwrap().val.unwrap())
                        }
                    }
                    let val:Option<T> = Some((self.cells.get(c.0).unwrap().fun)(values.as_slice()).into());
                    let start_value = self.cells.get(c.0).unwrap().val.unwrap();
                    if self.cells.get_mut(c.0).unwrap().val.unwrap() != val.unwrap() {
                        for (id,callback) in self.cells.get_mut(c.0).unwrap().callbacks.iter_mut(){
                            if !callback_start_value.contains_key(id){
                                //Value at very beginning
                                callback_start_value.insert(id.to_owned(),(cid.to_owned(),start_value));
                            }
                            callback_value_map.insert(id.to_owned(),val.unwrap());
                        }
                        self.cells.get_mut(c.0).unwrap().val = val;
                    }
                }
            }
        }
        for (id,v) in callback_value_map.iter() {
            if !callback_start_value.contains_key(id){
                continue;
            }
            if callback_start_value.get(id).unwrap().to_owned().1 != *v {
                let compute_id = self.cbcells.get(id).unwrap();
                (self.cells.get_mut(compute_id.0).unwrap().callbacks.get_mut(id).unwrap())(*v);
            }
        }
        true
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
        if self.cells.get(_id.0).is_none(){
            return None;
        }
        let callback_id = CallbackId(self.cb_ids);
        self.cb_ids += 1;
        self.cells.get_mut(_id.0).unwrap().callbacks.insert(callback_id,Box::new(_callback));
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
        if self.cells.get(cell.0).is_none() {
            return Err(RemoveCallbackError::NonexistentCell);
        }
        if self.cbcells.get(&callback).is_none(){
            return Err(RemoveCallbackError::NonexistentCallback);
        }
        self.cbcells.remove(&callback);
        self.cells.get_mut(cell.0).unwrap().callbacks.remove(&callback);
        Ok(())
    }
}