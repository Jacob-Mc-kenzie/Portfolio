let uwary= [];
let movement = {x: 10, y: 10, dx:2, dy: 1.5};
let dxc, dyc;
let index;
const scalar = 1500;
let oldwinx, oldwiny;
function setup() {
  createCanvas(windowWidth, windowHeight);
  index = createImage(200,200);
  index.loadPixels();
for (let i = 0; i < index.width; i++) {
  for (let j = 0; j < index.height; j++) {
    index.set(i, j, color(0,0,0));
  }
}
index.updatePixels();
  let i = 1;
  let onfail = ()=>{
    if(uwary.length > 0)
      index = uwary[0];
    console.log("failed at UwU-"+i+".png");
  }
  let onsucess = (img)=>{
    i++;
    uwary.push(img);
    loadImage('images/UwU-'+i+'.png', onsucess, onfail);
    index = uwary[0];
  }
  loadImage('images/UwU-'+i+'.png', onsucess, onfail);

  movement.dx = dxc = abs(randomGaussian(1))+1;
  movement.dy = dyc = abs(randomGaussian(1))+1;
  movement.dx = (dxc / windowWidth) * scalar;
  movement.dy = (dyc / windowHeight) * scalar;
  oldwinx = windowWidth;
  oldwiny = windowHeight;
}

function draw() {
  background(0);
  step();
  render(index, movement.x, movement.y);
}
function step(){
  let nx = movement.x + movement.dx;
  let ny = movement.y + movement.dy;
  if(nx <= 0 || nx >= windowWidth - index.width){
    movement.dx *= -1;
    index = random(uwary);
  }
  if(ny <= 0 || ny >= windowHeight - index.height){
    movement.dy *= -1;
    index = random(uwary);
  }
  movement.x += movement.dx;
  movement.y += movement.dy;
}

function render(frame, x, y){
  image(frame, x, y);
}

function windowResized() {
  if (windowWidth < index.width || windowHeight < index.height)
    return;
  resizeCanvas(windowWidth, windowHeight);
  movement.dx = (dxc / windowWidth) * scalar * (movement.dx < 0 ? -1: 1);
  movement.dy = (dyc / windowHeight) * scalar * (movement.dy < 0? -1: 1);
  movement.x = (movement.x / oldwinx) * windowWidth;
  movement.y = (movement.y / oldwiny) * windowHeight;
  oldwinx = windowWidth;
  oldwiny = windowHeight;
}
