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
let gameStarted = false;
let chickenControlsInitialized = false;
const grassStart = document.getElementById('grass-start');
const grassEnd = document.getElementById('grass-end');

// VALUES NEEDED TO START GAME
const startPage = document.getElementById('start-page');
const gamePage = document.getElementById('game-page');
const gameMusic = document.getElementById('game-music');

let scoreText = document.getElementById('score');
let livesText = document.getElementById('lives');
let levelText = document.getElementById('level');

let score = 0;
let lives = 3;

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
        window.requestAnimationFrame(moveCars);
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

    const initialDelay = Math.random() * 1500;
    setTimeout(() => {
        car.dataset.active = 'true';
    }, initialDelay);

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
    toKillAMockingBird()
    window.requestAnimationFrame(moveCars)
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
    let chickenRect = chicken.getBoundingClientRect();
    cars.forEach(car => {
        const carRect = car.getBoundingClientRect();

        if (carRect.x < chickenRect.x + chickenRect.width &&
        carRect.x + carRect.width > chickenRect.x &&
        carRect.y < chickenRect.y + chickenRect.height &&
        carRect.y + carRect.height > chickenRect.y) {
            console.log("SPLAT! GAME OVER");
        }
    })
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
        return alert("YOU WIN!")
    }
    lane += 2; 
    speed += 5;
    console.log("Current Level: ", currentLvl);
    console.log("Lanes: ", lane);

    createRoad(lane);
    resetChicken();
}


function resetChicken() {
    chicken.style.top = `${originalChickenTop}px`;
    chicken.style.left = `${originalChickenLeft}px`;
}

// function displayScore() {
//     let chickenRect = chicken.getBoundingClientRect();
//     let roads = Array.from(document.querySelectorAll('.cell'));

//     for(let road = 0; road < roads.length; road++){
//         let roadRect = road.getBoundingClientRect();

//          const intersects = (
//             chickenRect.y < roadRect.y + roadRect.height &&
//             chickenRect.y + chickenRect.height > roadRect.y &&
//             chickenRect.x < roadRect.x + roadRect.width &&
//             chickenRect.x + chickenRect.width > roadRect.x
//         );


//         if(intersects && !road.dataset.crossed){
//             console.log("Good job! Yu passed road ", roads[road]);
//             score += 5;
//             scoreText.textContent = score;
//             road.dataset.crossed = "true";
//         }
//     }
// }

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










export default startGame;
export {startPage, gameMusic};