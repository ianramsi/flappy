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
    }
}
