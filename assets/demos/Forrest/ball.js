

class Ball{
    constructor(avg_size, col){
        
        this.y = windowHeight+10;
        this.colour = col;
        this.speed = round(randomGaussian(windowHeight/5,windowHeight/7))
        this.size = abs(randomGaussian(avg_size,avg_size*0.75));
        this.y += this.size;
        this.x =  random(-this.size,windowWidth+this.size);

        this.speed = max(this.size,max(this.speed,windowHeight/7));

        if(this.y < windowHeight){
            console.log("ball created at x: "+this.x+", y: "+this.y+" with size: "+this.size);
        }
    }

    step(){
        this.y -= this.speed * (deltaTime/1000.0);
        if(this.y < -(this.size+10))
            return true;
        return false;
    }
    draw(){
        noStroke()
        fill(this.colour);
        circle(this.x,this.y,this.size);
    }
}