let lines = [];
let counter = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(12);
  colorMode(HSB);
  let amount = random(20,40);
  for(let i = 0; i < amount; i++){
    lines.push(new Line());
  }
  //lines.push(new Line());
  frameRate(24);
}

function draw() {
  background(0);
  for(let i = 0; i < lines.length; i++){
    lines[i].step();
    lines[i].render();
  }
  if(counter > 20){
    //noLoop();
  }
  else
    counter++;

}

