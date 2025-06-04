/**
 * @file utility.js
 * @game Chicken Crossroad
 * @author Diran Ojoodide
 * @date 2025-05-13
 * 
 * @description
 * Core functionsd for game logic
 * 
 */


const chicken = document.getElementById('chicken');
let originalChickenTop;
let originalChickenLeft;

console.log(`Chicken Left: ${originalChickenLeft}, Chicken Top: ${originalChickenTop}`)


let cars = [];
let currentLvl = 1;
let lane = 5;
let speed = 5;
let animationFrameID;
let gameStarted = false;
let chickenControlsInitialized = false;
let gameWon = false;
let gameLost = false;
const grassStart = document.getElementById('grass-start');
const grassEnd = document.getElementById('grass-end');

let restartWin = document.getElementById('restart-win');
let restartLose = document.getElementById('restart-lose');

// VALUES NEEDED TO START GAME
const startPage = document.getElementById('start-page');
const gamePage = document.getElementById('game-page');
const gameLosePage = document.getElementById('gameOverModal');
const gameWinPage = document.getElementById('gameWinModal');

let scoreText = document.getElementById('score');
let livesText = document.getElementById('lives');
let levelText = document.getElementById('level');

let score = 0;
let lives = 3;

// SOUNDS
const gameMusic = document.getElementById('game-music');
const levelUpSound = document.getElementById('lvl-music');
const loseLifeSound = document.getElementById('lose-life-music');
const gameOverSound = document.getElementById('game-over-music');


/**
 * Press Enter ot click on start button to start the game
 * Characters plus obstacles shouldnt move until game starts
 */

function startGame() {
    if(!gameStarted){
        startPage.style.display = 'none';
        gamePage.style.display = 'flex';
        gameStarted = true;

        gameMusic.play().catch(err => { 
            console.warn("Autoplay blocked:", err);
        });

        console.log("Game has started");
        
        originalChickenLeft = chicken.offsetLeft;
        originalChickenTop = chicken.offsetTop;


        createRoad();
        cars = Array.from(document.querySelectorAll('.car')); 
        animationFrameID = window.requestAnimationFrame(moveCars);
        movementControls();
        toKillAMockingBird();
    }
}

/**
 * Create dynamic board
 * So number of lanes in road can be increased per level
 */

function createRoad(lane) {
    let cols;
    const rows = 5;

    cols = currentLvl === 1 ? 5 : lane;
    const board = document.getElementById('board');
    board.innerHTML = '';

    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    for(let row = 0; row < rows; row++) {
        for(let col = 0; col < cols; col++) {
            if(row === 0){
            const car = createRandomCar(col);
            console.log(`car of col: ${col} has been created. Thank you.`)
            console.log(`Car.style.left = ${car.style.left}`)

            board.appendChild(car);
            }

            const cell = document.createElement('div');
            cell.className = 'cell';

            const line = document.createElement('div');
            line.className = 'broken-line';
            line.classList.add('flex-col');

            for(let i = 0; i < 4; i++){
                const dash = document.createElement('span');
                line.appendChild(dash);
            }

            cell.appendChild(line);

            // if(row === 0) {
            //     const car = createRandomCar();
            //     cell.appendChild(car)
            // }

            board.appendChild(cell);
            console.log("Road created")

        }
    }
}


function createRandomCar(colIndex) {
    const car = document.createElement('img');
    const randomCarNumber = Math.floor(Math.random() * 5) + 1;
    car.src = `assets/Images/car-${randomCarNumber}.svg`;
    car.className = 'car';
    car.dataset.yPos = '0';
    car.dataset.active = 'false';
    car.dataset.crossed = 'false';


    const board = document.getElementById('board');
    const boardRect = board.getBoundingClientRect();
    const colCount = getComputedStyle(board).gridTemplateColumns.split(" ").length;
    const colWidth = boardRect.width / colCount;
    const grassWidth = grassStart.getBoundingClientRect().width;

    car.style.left = `${grassWidth + colIndex * colWidth + colWidth / 4}px`;

    // const initialDelay = Math.random() * 1500;
    // setTimeout(() => {
    //     car.dataset.active = 'true';
    // }, initialDelay);

    
        car.dataset.active = 'true';

    return car;
}


function moveCars(){
    const cars = document.querySelectorAll('.car');
    const board = document.getElementById('board');
    const boardRect = board.getBoundingClientRect();

    cars.forEach(car => {
        if(car.dataset.active !== 'true') return;

        let carYPos = parseFloat(car.dataset.yPos) || 0;
        carYPos += speed;

        const carRect = car.getBoundingClientRect();

        // console.log(boardRect)
        

        if(carYPos > boardRect.bottom) {
            // carYPos = -boardRect.height;
            carYPos = -car.offsetHeight -10;
            car.dataset.active = 'false';

            const delay = Math.random() * 1500;
            setTimeout(() => {
                car.dataset.active = 'true';
            }, delay);
        }

        car.dataset.yPos = carYPos;
        car.style.transform = `translateY(${carYPos}px)`;
    });
    
    console.log("Car is moving")
    gameOver();

    if(lives > 0){
        animationFrameID = window.requestAnimationFrame(moveCars)
    }
}




function movementControls(chickenStep = 15, moveDelay = 200) {
    if (chickenControlsInitialized) return;
    chickenControlsInitialized = true;

    chicken.style.position = 'absolute';

    let canMove = true;

    document.addEventListener('keydown', (e) => {
        if (!canMove) return;

        
        let top = parseInt(chicken.style.top) || chicken.offsetTop;
        let left = parseInt(chicken.style.left) || chicken.offsetLeft;

        const chickenRect = chicken.getBoundingClientRect();
        const parentRect = chicken.parentElement.getBoundingClientRect();
        let moving = false;

        switch (e.key) {
            case 'ArrowUp':
                if (top - chickenStep >= 0) {
                    top -= chickenStep;
                    moving = true;
                }
                break;

            case 'ArrowDown':
                if (top + chickenStep + chickenRect.height <= parentRect.height) {
                    top += chickenStep;
                    moving = true;
                }
                break;

            case 'ArrowLeft':
                if (left - chickenStep >= 0) {
                    left -= chickenStep;
                    moving = true;
                }
                break;

            case 'ArrowRight':
                if (left + chickenStep + chickenRect.width <= parentRect.width) {
                    left += chickenStep;
                    moving = true;
                }
                break;
        }

        if (moving) {
            chicken.style.top = `${top}px`;
            chicken.style.left = `${left}px`;

            canMove = false;
            setTimeout(() => canMove = true, moveDelay);

            displayScore();
            successfulCross();
        }
    });
}


// // NOT WORKING
function toKillAMockingBird() {
    const chickenRect = chicken.getBoundingClientRect();
    const cars = document.querySelectorAll('.car');
    const reducedChicken = {
        x: chickenRect.x + 10,
        y: chickenRect.y + 10,
        width: chickenRect.width - 20,
        height: chickenRect.height - 20
    };

    let hit = false;

    cars.forEach(car => {
        const carRect = car.getBoundingClientRect();
        const reducedCar = {
            x: carRect.x + 10,
            y: carRect.y + 10,
            width: carRect.width - 20,
            height: carRect.height - 20
        };

        if (
            reducedCar.x < reducedChicken.x + reducedChicken.width &&
            reducedCar.x + reducedCar.width > reducedChicken.x &&
            reducedCar.y < reducedChicken.y + reducedChicken.height &&
            reducedCar.y + reducedCar.height > reducedChicken.y
        ) {

            if (!hit) {
                console.log("SPLAT! GAME OVER");
                lives--;
                livesText.textContent = lives;
                hit = true;
            }
        }
    })

    return hit;
}

function successfulCross() {
    let chickenRect = chicken.getBoundingClientRect();
    let grassEndRect = grassEnd.getBoundingClientRect();

    if(gameStarted && chickenRect.right >= grassEndRect.left) {
        console.log("You crossed safely. Well done")

            score += (currentLvl * 10);
            scoreText.textContent = score;

        levelUp();
    } 
}


function levelUp() {
    currentLvl++;
    if(currentLvl >= 4){
        gameWon = true;
        showGameWinScreen();

    }else {
        lane += 2; 
        speed += 5;

        levelText.textContent = currentLvl;
    
        console.log("Current Level: ", currentLvl);
        console.log("Lanes: ", lane);

        levelUpSound.pause();
        levelUpSound.currentTime = 0;
        levelUpSound.play();

        createRoad(lane);
        resetChicken();
    }

}


function resetChicken() {
    chicken.style.top = `${originalChickenTop}px`;
    chicken.style.left = `${originalChickenLeft}px`;
}


function displayScore() {
    let chickenRect = chicken.getBoundingClientRect();
    let roads = Array.from(document.querySelectorAll('.broken-line'));

    for (let road of roads) {
        let roadRect = road.getBoundingClientRect();

        const intersects = (
            chickenRect.y < roadRect.y + roadRect.height &&
            chickenRect.y + chickenRect.height > roadRect.y &&
            chickenRect.x < roadRect.x + roadRect.width &&
            chickenRect.x + chickenRect.width > roadRect.x
        );

        if (intersects && !road.dataset.crossed) {
            console.log("Good job! You passed road cell");
            score += 5;
            scoreText.textContent = score;
            road.dataset.crossed = "true";
        }
    }
}


function gameOver() {
    const hit = toKillAMockingBird();
    if(hit){
        if(lives === 0){
            console.log("GAME OVER!");
            gameLost = true;
             showGameOverScreen();

        }else {
            console.log(`Thats remaining ${lives} lives.`)

            loseLifeSound.pause();
            loseLifeSound.currentTime = 0;
            loseLifeSound.play();

            resetChicken();
        }
    } 
}


function showGameOverScreen() {
    if(gameLost){
        
        gameLosePage.style.display = 'flex';

        gamePage.style.display = 'none';
    }
    cancelAnimationFrame(animationFrameID);
    gameMusic.pause();
    gameOverSound.currentTime = 0;
    gameOverSound.play();

        restartLose.addEventListener('click', () =>{
      console.log("Game has been reset");
        resetGame();
    });

}

function showGameWinScreen() {
    if(gameWon){
        
    cancelAnimationFrame(animationFrameID);
        gameWinPage.style.display = 'flex';

        gamePage.style.display = 'none';
    }
    
    restartWin.addEventListener('click', () =>{
      console.log("Game has been reset");
        resetGame();
    });
}

function resetGame() {
    console.log("Reset is working")
    gameStarted = false;
    gameLost = false;
    gameWon = false;
    currentLvl = 1;
    lane = 5;
    speed = 5;
    score = 0;
    lives = 3;

    scoreText.textContent = score;
    livesText.textContent = lives;
    levelText.textContent = currentLvl;

    gameLosePage.style.display = 'none';
    gameWinPage.style.display = 'none';
    gamePage.style.display = 'flex';

    resetChicken();
    createRoad(lane);
    moveCars();

    gameMusic.currentTime = 0;
    gameMusic.play();
}


export {startGame, resetGame};
export {startPage, gameMusic, levelUpSound, loseLifeSound, gameOverSound};