//board
let board;
let boardWidth = 360;
let boardHeigth = 640;
let context;

//bird
let birdWidth = 34;
let birdHeigth = 24;
let birdX = boardWidth/2;
let birdY = boardHeigth/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    heigth : birdHeigth
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeigth = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let gameOver = false;
let score = 0;

//physics
let velocityX = -2; //pipe moving to left screen with speed 2
let velocityY = 0; //bird jump speed
let gravity = 0.3; //speed of the bird go down


window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.heigth = boardHeigth;
    context = board.getContext("2d"); //use for drawing the board

    //load images
    birdImg = new Image();
    birdImg.src = '../assets/flappybird.gif';
    birdImage.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.heigth);
    }
    
    topPipeImg = new Image();
    topPipeImg.src = '../assets/toppipe.png';

    bottomPipeImg = new Image();
    bottomPipeImg.src = '../assetes/bottompipe.png'

    requestAnimationFrame(update);
    setInterval(placePipes,1500); //every 1.5 sec
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver){
        return;
    }
    context.clearRect(0,0,board.width,board.heigth);

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY , 0)//apply gravity to the bird, limit the bird.y (vertical) to top of canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.heigth);

    if (bird.y > board.heigth){
        gameOver = true;
    }

    //pipes
    for (let r = 0; r < pipeArray.length; r++) {
        let pipe = pipeArray[r];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.heigth);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5; //0.5 because of two pipes top & bottom. 0.5 x 2 = 1
            pipe.passed = true;
        }
        if(detectCollission(bird,pipe)){
            gameOver = true;
        }
    }
    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes the first element of from array
    }

    //scores
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score,5,45);

    if(gameOver) {
        context.fillText ("Game Over",5,90);
    }
}

function detectCollission(a,b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function placePipes() {
    if(gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeigth/4 - Math.random()*(pipeHeigth/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        widht : pipeWidth,
        heigth : pipeHeigth,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeigth + openingSpace,
        widht : pipeWidth,
        height : pipeHeigth,
        passed : false
    }
    pipeArray.push(bottomPipe);    
}

function moveBird(e) {
    if(e.code == "ArrowUp" || e.code == "Space" || e.code == "KeyX") {
        //jump
        velocityY = -6;

           //reset the game
        if(gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

