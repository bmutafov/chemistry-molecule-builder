
function drawClearButton() {
  let canvas = document.getElementById('clear-butt');
  let context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  const roughCanvas = rough.canvas(document.getElementById('clear-butt'));
  roughCanvas.rectangle(0, 5, 50, 50, { fill: '#ff4747', fillStyle: 'solid' }); // x, y, width, height
  roughCanvas.rectangle(50, 2, 50, 50, { fill: '#ff4747', fillStyle: 'cross-hatch' }); // x, y, width, height
  roughCanvas.rectangle(100, 0, 50, 50, { fill: '#ff4747', fillStyle: 'hachure' }); // x, y, width, height

  context.font = "22px fantasy";
  context.fillText("Cl", 15, 40);
  context.fillText("e", 70, 34);
  context.fillText("Ar", 112, 35);
  context.font = "10px fantasy";
  context.fillText("17", 40, 15);
  context.fillText("-", 83, 27);
  context.fillText("18", 140, 10);
}

function drawClearButton_hover() {
  let canvas = document.getElementById('clear-butt');
  let context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  const roughCanvas = rough.canvas(document.getElementById('clear-butt'));
  roughCanvas.rectangle(0, 3, 50, 50, { fill: '#ff4747', fillStyle: 'solid' }); // x, y, width, height
  roughCanvas.rectangle(50, 3, 50, 50, { fill: '#ff4747', fillStyle: 'solid' }); // x, y, width, height
  roughCanvas.rectangle(100, 3, 50, 50, { fill: '#ff4747', fillStyle: 'solid' }); // x, y, width, height

  context.font = "22px fantasy";
  context.fillText("Cl", 15, 38);
  context.fillText("e", 70, 35);
  context.fillText("Ar", 112, 38);
  context.font = "10px fantasy";
  context.fillText("17", 40, 13);
  context.fillText("-", 83, 28);
  context.fillText("18", 140, 13);
}

function drawDoneButton() {
  let canvas = document.getElementById('submit-butt');
  let context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  const roughCanvas = rough.canvas(document.getElementById('submit-butt'));
  roughCanvas.rectangle(0, 0, 50, 50, { fill: '#69ffca', fillStyle: 'solid' }); // x, y, width, height
  roughCanvas.rectangle(50, 5, 50, 50, { fill: '#69ffca', fillStyle: 'cross-hatch' }); // x, y, width, height
  roughCanvas.rectangle(100, 0, 50, 50, { fill: '#69ffca', fillStyle: 'dashed' }); // x, y, width, height

  context.font = "22px fantasy";
  context.fillText("D", 15, 35);
  context.fillText("O", 65, 40);
  context.fillText("Ne", 112, 35);
  context.font = "10px fantasy";
  context.fillText("1", 40, 10);
  context.fillText("8", 90, 15);
  context.fillText("10", 138, 10);
}

function drawDoneButton_hover() {
  let canvas = document.getElementById('submit-butt');
  let context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  const roughCanvas = rough.canvas(document.getElementById('submit-butt'));
  roughCanvas.rectangle(0, 3, 50, 50, { fill: '#69ffca', fillStyle: 'solid' }); // x, y, width, height
  roughCanvas.rectangle(50, 3, 50, 50, { fill: '#69ffca', fillStyle: 'solid' }); // x, y, width, height
  roughCanvas.rectangle(100, 3, 50, 50, { fill: '#69ffca', fillStyle: 'solid' }); // x, y, width, height
  context.font = "22px fantasy";
  context.fillText("D", 15, 37);
  context.fillText("O", 65, 37);
  context.fillText("Ne", 112, 37);
  context.font = "10px fantasy";
  context.fillText("1", 40, 12);
  context.fillText("8", 90, 12);
  context.fillText("10", 138, 12);
}

drawDoneButton();
drawClearButton();

$('#submit-butt').hover(drawDoneButton_hover, drawDoneButton);
$('#clear-butt').hover(drawClearButton_hover, drawClearButton);