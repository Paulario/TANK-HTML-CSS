const PLAYGROUND = getSel('#playground');
const FIELD = getSel('#field');
const PLAYER = getSel('.tank');
const PLAYER_WIDTH = PLAYER.offsetWidth;
const PLAYER_HEIGHT = PLAYER.offsetHeight;
const SPEED = 6;
const ROTATION_SPEED = 4 * Math.PI / 180;
const BULLET_SPEED = 50;
const AUDIO_GUN_SHOOT = document.querySelector('audio');
let BULLET_HEIGHT = 4;
let BULLET_WIDTH = 10;
let timestamp = 0;
const COLORS = ['tomato', 'red', 'green', 'blue', 
    'yellow', 'black', 'white', 'purple']

function moveTank(){
    let pressed = new Set();
    document.addEventListener('keydown', function(event){
        pressed.add(event.code);
        movementHandler(pressed);
        if(event.code === 'KeyU' && event.ctrlKey){
            event.preventDefault();
            let bullets = document.querySelectorAll('.bullet');
            for(const bullet of bullets){
                bullet.remove();
            }
        }
        timestamp = event.timeStamp;
    });
    document.addEventListener('keyup', function(event){
        pressed.delete(event.code);
        timestamp = event.timeStamp;
    });
}

function mouseMovement(event){
    // Rotate
    let currentBodyAngle = +PLAYER.style.transform.slice(7,-4);
    let theta = getGunAngle(event);
    let gunHat = PLAYER.querySelector('.tank-hat');
    gunHat.style.transform = `rotate(${theta-currentBodyAngle}rad)`;
    timestamp = event.timeStamp;
}

function getGunAngle(event){
    let mousePageX, mousePageY, posPageX, posPageY;
    mousePageX = event.clientX;
    mousePageY = event.clientY;
    posPageX = PLAYER.offsetLeft + PLAYER.offsetParent.offsetLeft + PLAYER.offsetWidth / 2;
    posPageY = PLAYER.offsetTop + PLAYER.offsetParent.offsetTop + PLAYER.offsetHeight / 2;
    // Calculate the angle of rotation
    let tanOfTheta, theta, isMouseBehindTank;
    tanOfTheta = (mousePageY-posPageY)/(mousePageX-posPageX);
    isMouseBehindTank = (mousePageY < posPageY && mousePageX < posPageX) ||
        (mousePageY > posPageY && mousePageX < posPageX)
    if(isMouseBehindTank){
        theta = Math.atan(tanOfTheta) + Math.PI;
    } else {
        theta = Math.atan(tanOfTheta);
    }
    return theta;
}

function getGunTip(event){
    let posPageX, posPageY, mousePageX, mousePageY;
    let gun = getSel('.tank-hat-gun');
    let gunRect = gun.getBoundingClientRect();
    console.log(gunRect);
    let gunHeight = parseFloat(getComputedStyle(gun).height);
    let shiftY = Math.cos(Math.PI/4) * gunHeight;
    let shiftX = Math.sin(Math.PI/4) * gunHeight;
    posPageY = gunRect.top + gunRect.height;
    posPageX = gunRect.left + gunRect.width;
    mousePageX = event.clientX;
    mousePageY = event.clientY;
    if(mousePageY < posPageY && mousePageX < posPageX){
        console.log('top-left');
        shiftY -= BULLET_HEIGHT / 2;
        shiftX -= BULLET_WIDTH / 2;
        return [gunRect.left + shiftX, gunRect.top + shiftY];
    } else if(mousePageY < posPageY && mousePageX > posPageX){
        console.log('top-right');
        shiftY -= BULLET_HEIGHT / 2;
        shiftX += BULLET_WIDTH / 2;
        return [gunRect.right - shiftX, gunRect.top + shiftY];
    } else if(mousePageY > posPageY && mousePageX < posPageX){
        console.log('bottom-left');
        shiftY += BULLET_HEIGHT / 2;
        shiftX -= BULLET_WIDTH / 2;
        return [gunRect.left + shiftX, gunRect.bottom - shiftY];
    } else if(mousePageY > posPageY && mousePageX > posPageX){
        console.log('bottom-right');
        shiftY += BULLET_HEIGHT / 2;
        shiftX += BULLET_WIDTH / 2;
        return [gunRect.right - shiftX, gunRect.bottom - shiftY];
    }
}

function movementHandler(codes){
    for(const code of codes){
        let currentBodyAngle = +PLAYER.style.transform.slice(7,-4);
        if(code === 'KeyS'){
            let dx = Math.sin(currentBodyAngle) * SPEED;
            let dy = Math.cos(currentBodyAngle) * SPEED;
            PLAYER.style.top = PLAYER.offsetTop - dx + 'px';
            PLAYER.style.left = PLAYER.offsetLeft - dy + 'px';
        }
        if(code === 'KeyW'){
            let dx = Math.sin(currentBodyAngle) * SPEED;
            let dy = Math.cos(currentBodyAngle) * SPEED;
            PLAYER.style.top = PLAYER.offsetTop + dx + 'px';
            PLAYER.style.left = PLAYER.offsetLeft + dy + 'px';
        }
        if(code === 'KeyD'){
            PLAYER.style.transform = `rotate(${currentBodyAngle + ROTATION_SPEED}rad)`;
        }
        if(code === 'KeyA'){
            PLAYER.style.transform = `rotate(${currentBodyAngle - ROTATION_SPEED}rad)`;
        }
        borderCollisionHandler(PLAYER);
        // enemyCollisionHandler(PLAYER);
    }
}

function borderCollisionHandler(elem){
    let currentBodyAngle = +elem.style.transform.slice(7,-4);
    let sinOfCurrentBodyAngle = Math.abs(Math.sin(currentBodyAngle));
    let verticalTolerance = sinOfCurrentBodyAngle * elem.offsetHeight / 2;
    let horizontalTolerance = sinOfCurrentBodyAngle * elem.offsetWidth / 4;
    if(hitTopBorder(elem)){
        elem.style.top = verticalTolerance + 'px';
    }
    if(hitBottomBorder(elem)){
        elem.style.top = FIELD.offsetHeight - elem.offsetHeight - verticalTolerance + 'px';
    }
    if(hitRightBorder(elem)){
        elem.style.left = FIELD.offsetWidth - elem.offsetWidth + horizontalTolerance + 'px';
    }
    if(hitLeftBorder(elem)){
        elem.style.left = - horizontalTolerance + 'px';
    }
}

function hitTopBorder(elem){
    let currentBodyAngle = +elem.style.transform.slice(7,-4);
    let sinOfCurrentBodyAngle = Math.abs(Math.sin(currentBodyAngle));
    let tol = sinOfCurrentBodyAngle * elem.offsetHeight / 2;
    let r = elem.getBoundingClientRect();
    return elem.offsetTop < tol
        + (elem.matches('.bullet') ? field.offsetTop + 2*r.height : 0)

}

function hitRightBorder(elem){
    let currentBodyAngle = +elem.style.transform.slice(7,-4);
    let sinOfCurrentBodyAngle = Math.abs(Math.sin(currentBodyAngle));
    let tol = sinOfCurrentBodyAngle * elem.offsetWidth / 4;
    let r = elem.getBoundingClientRect();
    return elem.offsetLeft > FIELD.offsetWidth 
        - elem.offsetWidth 
        + (elem.matches('.bullet') ? field.offsetLeft - 2*r.width : 0)
        + tol;
}

function hitBottomBorder(elem){
    let currentBodyAngle = +elem.style.transform.slice(7,-4);
    let sinOfCurrentBodyAngle = Math.abs(Math.sin(currentBodyAngle));
    let tol = sinOfCurrentBodyAngle * elem.offsetHeight / 2;
    let r = elem.getBoundingClientRect();
    return elem.offsetTop > FIELD.offsetHeight 
        - elem.offsetHeight 
        + (elem.matches('.bullet') ? field.offsetTop - 2*r.height : 0)
        - tol;
}

function hitLeftBorder(elem){
    let currentBodyAngle = +elem.style.transform.slice(7,-4);
    let sinOfCurrentBodyAngle = Math.abs(Math.sin(currentBodyAngle));
    let tol = sinOfCurrentBodyAngle * elem.offsetWidth / 4;
    let r = elem.getBoundingClientRect();
    return elem.offsetLeft < -tol +
        (elem.matches('.bullet') ? field.offsetLeft + 2*r.width : 0);
}

function bulletCollisionHandler(elem){
    if(hitTopBorder(elem) 
        || hitBottomBorder(elem) 
        || hitRightBorder(elem) 
        || hitLeftBorder(elem)){
        elem.classList.add('dissapear');
        elem.style.transform += ' scale(2)';
        setTimeout(() => elem.remove(), 400);
    }
}

function releaseBullet(event){
    let theta = getGunAngle(event);
    let bullet = document.createElement('div');
    bullet.classList.add('bullet');
    let gunPos = getGunTip(event);
    let boxShadowColor = COLORS[getRandom(COLORS.length - 1)];
    bullet.style.top = gunPos[1] + 'px';
    bullet.style.left = gunPos[0] + 'px';
    bullet.style.transform =  `rotate(${theta}rad)`;
    bullet.style.boxShadow = `0 0 5px ${boxShadowColor}`;
    bullet.style.width = BULLET_WIDTH + 'px';
    bullet.style.height = BULLET_HEIGHT + 'px';
    let color = COLORS[getRandom(COLORS.length - 1)];
    bullet.classList.add(color);
    getSel('#field').append(bullet);
    let dx = Math.sin(theta) * BULLET_SPEED;
    let dy = Math.cos(theta) * BULLET_SPEED;
    for(let i=0; i<200; i++){
        setTimeout(() => {
            bullet.style.top = bullet.offsetTop + dx + 'px';
            bullet.style.left = bullet.offsetLeft + dy + 'px';
            bulletCollisionHandler(bullet);
        }, 50*i);
    }
}


function getSel(sel){
    return document.querySelector(sel);
}

function getCoordinates(event){
    console.log(`(x=${event.x}; y=${event.y})`);
}

function getRandom(max){
    return Math.round(Math.random()*max);
}

function randomizer(min, max) {
    let diff = max - min;
    let rand = Math.round(Math.random()*diff);
    return min + rand;
}

function randomizeArray(array){
    const arrayCopy = [].concat(array);
    let rand = getRandom(array.length-1);
    let randomizedArray = new Array(array.length);
    for(let i=0; i<array.length; i++){
        randomizedArray[i] = arrayCopy.splice(rand, 1)[0];
        rand = getRandom(arrayCopy.length-1);
    }
    return randomizedArray;
}

