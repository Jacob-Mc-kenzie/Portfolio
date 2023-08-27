class dot{
    constructor(x,y, indel){
        this.x = x;
        this.y =  y;
        this.initialy = y;
        this.wobble = randomGaussian(0,1);
        this.lifespan = randomGaussian(100,10);

        this.indel = indel
    }
    step(){
        if(this.indel > 0){
            this.indel -= deltaTime;
        }
        else{
        if(this.lifespan > 1){
            this.y = lerp(this.y, this.y-this.lifespan,0.05);
            this.x = lerp(this.x, this.x+this.wobble,0.1);
            this.lifespan -= 170 * (deltaTime /1000);
        }
        else{
            this.lifespan = randomGaussian(80,10);
            this.wobble = randomGaussian(0,1);
            this.y = this.initialy;
        }
    }
    }
    
}