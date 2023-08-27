let fgcolor = null;
let bgcolor = null;
let shapes = [];
function setup(c) {
  shapes = [];
  createCanvas(windowWidth, windowHeight);
  for(let i = 0; i < windowWidth;i+= 3){
    shapes.push(new dot(i,windowHeight/2, random(0,2000)));
  }
  if(c == null)
  GenerateNewColor();
  document.body.style.backgroundColor = 'rgb('+bgcolor[0]+','+bgcolor[1]+','+bgcolor[2]+')';
  noStroke();
  fill(fgcolor[0],fgcolor[1],fgcolor[2]);
}

function draw() {
  background(bgcolor[0],bgcolor[1],bgcolor[2]);
  //status
  
  rect(0,windowHeight/2 -40,windowWidth,windowHeight/2 + 40);
  for(let i = 0; i< shapes.length; i++){
    shapes[i].step();
    circle(shapes[i].x,shapes[i].y,shapes[i].lifespan)
  }
}



function GenerateNewColor() {
  let c = random(0,360);
  bgcolor = hsv2rgb(c,0.53,0.90);
  fgcolor = hsv2rgb(c,0.53,0.65);
  if(random(0,10) > 7){
    bgcolor = [255,255,255];
    fgcolor = [0,0,0];
  }
}
function windowResized(){
  setup(true);
}


//  input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
// from https://stackoverflow.com/a/54024653
function hsv2rgb(h,s,v) 
{                              
  let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [f(5)*255,f(3)*255,f(1)*255];       
}   



