'use strict';

// instantiate a string array
let seasons =["spring","autumn","summer","winter"];
let things = ["it","cat"];

function modify(array){
    for(let l of array){
        if(l.length<2){
            console.log("");
        }
        else{
            console.log(l.substring(0,2) + l.substring(l.length -2,  l.length));
        }
       
    }
}

modify(seasons);
modify(things);