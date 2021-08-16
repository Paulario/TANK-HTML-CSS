'use strict';


function createEnemy(){
    let startingAngle = getRandom(360)*(Math.PI/180);
    FIELD.insertAdjacentHTML('beforeend', 
        `
            <div class="tank enemy">
                <div class="tank-hat">
                    <div class="tank-hat-gun"></div>
                </div>
            </div>
        `)
    let enemy = FIELD.lastElementChild;
    enemy.style
        .transform = `rotate(${startingAngle}rad)`;
    enemy.style.top = getRandom(enemy.offsetParent.offsetHeight)+'px';
    enemy.style.left = getRandom(enemy.offsetParent.offsetWidth)+'px';
    borderCollisionHandler(enemy);
}


function enemyCollisionHandler(){
    let enemies = FIELD.querySelectorAll('.enemy');
    for(const enemy of enemies){
        hitEnemyTop(enemy, PLAYER);
        hitEnemyLeft(enemy, PLAYER);
    }
}

function hitEnemyTop(enemy, player){
    let p = player.getBoundingClientRect();
    let e = enemy.getBoundingClientRect();
    let bodyAngle = player.style.transform.slice(7,-4);
    if(p.bottom > e.top && p.bottom < e.bottom){
        player.style.top = e.top - p.height + PLAYER_HEIGHT*Math.sin(bodyAngle) - FIELD.offsetTop + 'px';
    }
}

function hitEnemyLeft(enemy, player){
    let p = player.getBoundingClientRect();
    let e = enemy.getBoundingClientRect();
    if(p.right > e.left && p.right < e.right){
        player.style.left = e.left - p.width - FIELD.offsetLeft + 'px';
    }
}

