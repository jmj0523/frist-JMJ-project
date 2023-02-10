
//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas);

let groundImage,alienImage,bulletImage,spaceImage,gameoverImage;
let gameover=false;
let score=0;

//우주선 좌표
let spaceX = canvas.width/2-30
let spaceY = canvas.height-60

let bulletList = []
function Bullet(){
    this.x = 0;
    this.y = 0;
    this.init=function(){
        this.x = spaceX+5;
        this.y = spaceY;
        this.alive=true;
        bulletList.push(this);
    };
    this.update = function(){
        this.y-=7;
    };

    this.checkHit=function(){

        for(let i=0;i<alienList.length;i++){
        if(this.y <=alienList[i].y && 
           this.x>=alienList[i].x && 
           this.x<=alienList[i].x+40
           ){
        score++;
        this.alive =false;
        alienList.splice(i,1);
           }
        }
    };
}

function generateRandomValue(min,max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum;
}

let alienList=[]
function alien(){
    this.x=0;
    this.y=0;
    this.init =function(){
        this.y=0
        this.x=generateRandomValue(0,canvas.width-91)
        alienList.push(this)
    };
    this.update=function(){
        this.y += 3;

        if(this.y>= canvas.height-91){
            gameover=true;
        }
    }
}

function loadImage(){
    groundImage = new Image();
    groundImage.src="images/ground.jpg";

    spaceImage = new Image();
    spaceImage.src= "images/space.gif.png";

    alienImage = new Image();
    alienImage.src= "images/alien.gif.png";

    bulletImage = new Image();
    bulletImage.src= "images/bullet.gif.png";

    gameoverImage = new Image();
    gameoverImage.src= "images/gameover.gif.png";
}

let keysDown = {};
function setupKeyboardListener(){
    document.addEventListener("keydown",function(event){
        keysDown[event.keyCode] = true;
    });
    document.addEventListener("keyup",function(event){
        delete keysDown[event.keyCode];

        if(event.keyCode == 32){
            createBullet()
        }
    });
}

function createBullet(){
    let b = new Bullet();
    b.init();
}

function createalien(){
    const interval = setInterval(function(){
        let e = new alien()
        e.init()
    },1000)
}

function update(){
    if( 39 in keysDown){
        spaceX += 3;
    } //오른쪽
    if( 37 in keysDown){
        spaceX -= 3;
    } //왼쪽

    if(spaceX <=0){
        spaceX = 0;
    }
    if(spaceX >= canvas.width-60){
        spaceX = canvas.width-60;
    }
    for(let i=0;i<bulletList.length;i++){
        if(bulletList[i].alive){
        bulletList[i].update();
        bulletList[i].checkHit();
    }
}

    for(let i=0;i<alienList.length;i++){
        alienList[i].update();
    }
}

function render(){
    ctx.drawImage(groundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceImage, spaceX, spaceY);
    ctx.fillText(`Score:${score}`, 20,20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
        ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
}

    for(let i=0; i<alienList.length; i++){
        ctx.drawImage(alienImage, alienList[i].x, alienList[i].y);
    }
}

function main(){
    if(!gameover){
    update();
    render();
    requestAnimationFrame(main);
    }else{
        ctx.drawImage(gameoverImage,10,100,380,380)
    }
}

loadImage();
setupKeyboardListener();
createalien();
main();