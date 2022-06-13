import * as myFunctions from './functions.mjs';

myFunctions.linksPreventDefault();

const form = document.querySelector("form[name='form']");

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  let dataArray = [];
  for (const [name, value] of data) {
    dataArray.push([name, value])
  }
  alert(dataArray);
})