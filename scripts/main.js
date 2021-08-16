'use strict';


PLAYER.style.transform = `rotate${Math.PI/4}rad)`;
 
moveTank();
createEnemy();
document.body.addEventListener('mousemove', mouseMovement);
document.body.addEventListener('click', (event) => {
    releaseBullet(event);
    timestamp = event.timeStamp;
});
document.body.addEventListener('keydown', (event) => {
    if(event.code == 'KeyB'){
        event.preventDefault();
        let factor = 1.05;
        let w = PLAYER.offsetWidth * factor;
        let h = PLAYER.offsetHeight * factor;
        BULLET_HEIGHT *= factor;
        BULLET_WIDTH *= factor;
        PLAYER.style.width = w+'px';
        PLAYER.style.height = h+'px';
    }
    if(event.code == 'KeyN'){
        event.preventDefault();
        let factor = 0.95
        let w = PLAYER.offsetWidth * factor;
        let h = PLAYER.offsetHeight * factor;
        BULLET_HEIGHT *= factor;
        BULLET_WIDTH *= factor;
        PLAYER.style.width = w+'px';
        PLAYER.style.height = h+'px';
    }
});


