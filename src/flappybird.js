//board
let board;
let boardWidth = 360;
// Changed: Fixed typo from 'boardHeigth' to 'boardHeight'
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
// Changed: Fixed typo from 'birdHeigth' to 'birdHeight'
let birdHeight = 24;
let birdX = boardWidth/2;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    // Changed: Fixed typo from 'heigth' to 'height'
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
// Changed: Fixed typo from 'pipeHeigth' to 'pipeHeight'
let pipeHeight = 512;
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
    // Changed: Fixed typo from 'board.heigth' to 'board.height'
    board.height = boardHeight;
    context = board.getContext("2d"); //use for drawing the board

    //load images
    birdImg = new Image();
    // Changed: Updated absolute path to relative path
    birdImg.src = 'assets/flappybird.gif';
    // Changed: Fixed typo from 'birdImage' to 'birdImg'
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }
    
    topPipeImg = new Image();
    // Changed: Updated absolute path to relative path
    topPipeImg.src = 'assets/toppipe.png';

    bottomPipeImg = new Image();
    // Changed: Updated absolute path to relative path
    bottomPipeImg.src = 'assets/bottompipe.png';

    requestAnimationFrame(update);
    setInterval(placePipes,1500); //every 1.5 sec
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver){
        return;
    }
    // Changed: Fixed typo from 'board.heigth' to 'board.height'
    context.clearRect(0,0,board.width,board.height);

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY , 0)//apply gravity to the bird, limit the bird.y (vertical) to top of canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    if (bird.y > board.height){
        gameOver = true;
        dieSound.play(); // sound when bird dies
    }
    }

    //pipes
    for (let r = 0; r < pipeArray.length; r++) {
        let pipe = pipeArray[r];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5;
            pipe.passed = true;
            pointSound.play(); // sound when bird pass the pipe
        }
        if(detectCollision(bird,pipe)){
            gameOver = true;
            hitSound.play(); // sound when bird hits the pipe
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

function detectCollision(a,b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function placePipes() {
    if(gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        // Changed: Fixed typo from 'widht' to 'width'
        width : pipeWidth,
        // Changed: Fixed typo from 'heigth' to 'height'
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        // Changed: Fixed typo from 'widht' to 'width'
        width : pipeWidth,
        // Changed: Fixed typo from 'heigth' to 'height'
        height : pipeHeight,
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

//sound
let dieSound = new Audio('assets/sfx_die.wav');
let pointSound = new Audio('assets/sfx_point.wav');
let hitSound = new Audio('assets/sfx_hit.wav');
