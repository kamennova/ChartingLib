
let vertical_axises = document.getElementsByClassName('vertical-axis-labels-container');
let horizontal_axises = document.getElementsByClassName('horizontal-axis-labels-container');

for(let i =0; i < vertical_axises.length; i++){
  vertical_axises[i].style.height =  '300px';
  horizontal_axises[i].style.width =  '400px';
}