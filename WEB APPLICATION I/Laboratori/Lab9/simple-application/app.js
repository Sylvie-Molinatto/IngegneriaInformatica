'use strict';

const main = async() => {
  const response = await fetch('http://localhost:3001/api/films');
  if(response.ok) {
    const data = await response.text();
    document.getElementById('result').innerText = data;
  }
}

main();