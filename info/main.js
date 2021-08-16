'use strict';

// document.getElementById('example').
//     addEventListener('click', function() {
//         let scrollBottom = this.scrollHeight 
//             - this.scrollTop 
//             - this.clientHeight;
//         console.log(scrollBottom);
//     });

// console.log(getScrollbarWidth());

// const BALL = document.getElementById('ball');
// let msg = createMessageUnder(BALL, 'Hello world');
// document.body.append(msg);

// let field = document.querySelector('#field');
// let fieldRect = field.getBoundingClientRect();

// let outerTopLeft = [
//     fieldRect.left,
//     fieldRect.top,
// ]
// console.log('outerTopLeft =>', outerTopLeft);
// let outerBottomRight = [
//     fieldRect.right,
//     fieldRect.bottom,
// ]
// console.log('outerBottomRight =>', outerBottomRight);
// let innerTopLeft = [
//     fieldRect.left + field.clientLeft,
//     fieldRect.top + field.clientTop,
// ]
// console.log('innerTopLeft =>', innerTopLeft);
// let innerBottomLeft = [
//     fieldRect.left + field.clientLeft + field.clientWidth,
//     fieldRect.top + field.clientTop + field.clientHeight,
// ]
// console.log('innerBottomLeft =>', innerBottomLeft);


let noteTop = document.createElement('div');
noteTop.textContent = 'noteTop';
noteTop.classList.add('note');

let quote = document.querySelector('blockquote');
document.body.style.height = '2000px';

document.getElementById('select').addEventListener('change', function(event) {
    positionAt(quote, noteTop,this.value);
});
// positionAt(quote, noteTop.cloneNode(true), "bottom");
// positionAt(quote, noteTop.cloneNode(true), "right");

function positionAt(anchor, elem, position='top-out'){
    let coords = getCoords(anchor);
    if(isHidden(elem)){
        elem.style.display = 'block';
    }
    console.dir(anchor);
    anchor.append(elem);
    switch(position) {
        case 'top-out':
            elem.style.top = (coords.top - elem.offsetHeight) + 'px';
            elem.style.left = coords.left + 'px';
            break;
        case 'bottom-out':
            elem.style.top = coords.bottom + 'px';
            elem.style.left = coords.left + 'px';
            break;
        case 'right-out':
            elem.style.top = coords.top + 'px';
            elem.style.left = coords.right + 'px';
            break;
        case 'top-in':
            console.log('here');
            elem.style.top = coords.top + 'px';
            elem.style.left = coords.left + anchor.clientLeft  + 'px';
            break;
        case 'bottom-in':
            elem.style.top = coords.bottom - elem.offsetHeight + 'px';
            elem.style.left = coords.left + anchor.clientLeft + 'px';
            break;
        case 'right-in':
            elem.style.top = coords.top + 'px';
            elem.style.left = coords.right - elem.offsetWidth + 'px';
            break;
        }
    elem.style.visibility = 'visible';
}


function isHidden(elem){
    return !elem.offsetHeight && !elem.offsetWidth;
}
function getCoords(elem) {
    let clientCoords = elem.getBoundingClientRect();

    return {
        top: clientCoords.top + pageYOffset,
        left: clientCoords.left + pageXOffset,
        right: clientCoords.left + elem.offsetWidth + pageXOffset,
        bottom: clientCoords.top + elem.offsetHeight + pageYOffset,
    }
}

function getScrollbarWidth() {
    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;

}

function createMessageUnder(elem, html) {
    let message = document.createElement('div');
    message.style.cssText = "position:absolute; color: red";

    let coords = getCoords(elem);
    console.log(coords);

    message.style.left = coords.left + "px";
    message.style.top = coords.bottom + "px";

    message.innerHTML = html;

    return message;
}
