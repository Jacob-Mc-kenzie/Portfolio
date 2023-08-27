class Line{
    constructor(segmentLengths, rotations, colors, segmentsPerStep){
        this.segmentLengths = segmentLengths != null ? segmentLengths : [];
        this.rotations = rotations != null ? rotations : [];
        this.colors = colors != null ? colors : [];
        this.segmentsPerStep = segmentsPerStep != null ? segmentsPerStep : 4;
        this.index = 0;
        this.segmentsOnScreen = 0;
        this.startPoint = [0,0];
        this.startAngle = 0;
        this.endTrigger = false;
        this.saturation = 80;
        this.lum = 90;
        this.generate();
    }
    generate(){
        this.index = 0;
        this.endTrigger = false;
        this.segmentsOnScreen = 0;
        let speed = random(1, 8);
        let segments = random(10,30);
        this.colors = [];
        let baseColor = [round(random(0,255)),this.saturation, this.lum];
        this.colors.push(baseColor);
        this.rotations = [];
        this.segmentLengths = [];
        let picker = random() > 0.5 ? random() > 0.5 ? 0 : 1 : random() > 0.5 ? 2 : 3;
        if(picker == 0){
            this.startPoint = [random(0,windowWidth),0];
            this.startAngle = random(0.1,PI);
        }
        else if (picker == 1){
            this.startPoint = [random(0,windowWidth),windowHeight];
            this.startAngle = random(PI,TWO_PI);
        }
        else if (picker == 2){
            this.startPoint = [0,random(0,windowHeight)];
            this.startAngle = random() > 0.5 ? random(0,HALF_PI) : random(PI+HALF_PI,TWO_PI);
        }
        else if (picker == 3){
            this.startPoint = [windowWidth, random(0,windowHeight)];
            this.startAngle = random(PI+HALF_PI,HALF_PI);
        }
        for(let i = 0; i < segments; i++){
            this.segmentLengths.push(speed);
            this.rotations.push(randomGaussian(0,QUARTER_PI/4));
            speed += randomGaussian(1,2.2);
            if(speed < 0)
                speed = 1;
        }
    }
    step(){
        if(this.segmentsOnScreen >= this.segmentsPerStep)
            this.index++;
        else{
            this.segmentsOnScreen++;
        }
    }
    render(){
        push();
        translate(this.startPoint[0],this.startPoint[1]);
        rotate(this.startAngle);
        //stroke(this.colors[0][0],this.colors[0][1],this.colors[0][2]);
        for (let index = 0; index < this.segmentLengths.length; index++) {
            if(index > this.index && index < this.index+this.segmentsOnScreen)
                stroke(this.colors[0][0],this.colors[0][1],this.colors[0][2]);
            else
                stroke(0,0,0,0);
            //let j = min(index+ this.index, this.segmentLengths.length-1);
            line(0,0,this.segmentLengths[index],0);
            translate(this.segmentLengths[index],0);
            rotate(this.rotations[index]);
        }
        pop();
        if(this.index+this.segmentsPerStep > this.rotations.length-1)
            this.endTrigger = true;
        if(this.endTrigger && this.index >= this.segmentLengths.length)
            this.generate();
    }
    rotateLine(x1,y1,x2,y2, rotato){
        x2 -= x1;
        y2 -= y1;
        //convert to polar
        let r = sqrt(pow(x2,2)+pow(y2,2));
        let theta = atan(y2/x2);
        theta += rotato;
        return [r * cos(theta), r * sin(theta)];
    }

}