
let avg_ball_size = 50;
let isportrait = false;

const max_balls = 300;

let balls = [];

let time = 0;

const pallet = ['#00232d','#00232d','#da6b1b','#276154','#276154','#ffad00','#a4b86d']
function setup() {
  createCanvas(windowWidth,windowHeight);
  init();
}

function init(){
  isportrait = windowHeight > windowWidth;
  balls = [];

  time = 0;
  //setup the balls
  avg_ball_size = isportrait ? windowWidth * 0.1 : windowHeight * 0.1;
  for(let i = 0; i < 50; i++)
    balls.push( new Ball(avg_ball_size,pallet[round(random(0,pallet.length-1))]));
}

function draw() {
  background('#00232d');
  for(let i = 0; i < balls.length; i++){
    if(balls[i].step()){
      balls[i] = new Ball(avg_ball_size,pallet[round(random(0,pallet.length-1))]);
    }
    balls[i].draw();
  }
  if(time/2 < 900 && balls.length < max_balls){
    balls.push( new Ball(avg_ball_size,pallet[round(random(0,pallet.length-1))]));
  }
  time = (time + deltaTime) % 1000;
}

function ballstat(){
  let fastest = 0;
  let textblockf = "";
  let slowest = 20;
  let textblocks = "";
  for(let i =  0; i < balls.length; i++){
    if(balls[i].speed > fastest){
      fastest = balls[i].speed;
      textblockf = "ball "+i+" fastest at "+fastest;
    }
    if(balls[i].speed < slowest){
      slowest = balls[i].speed;
      textblocks = "ball "+i+" slowest at "+slowest;
    }
  }
  console.log(textblockf);
  console.log(textblocks);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  init();
}
