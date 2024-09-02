const canvas = document.getElementById("gamearea");
const ctx = canvas.getContext("2d");

var ligne1 = [0, 0, 0];
var ligne2 = [0, 0, 0];
var ligne3 = [0, 0, 0];
var poscircle = [];
var poscross = [];
const lignes = [ligne1, ligne2, ligne3];
var playerNum = 1;
var phase = "p";
var canvasrotation = 0;

var circledrawcount;
var circledrawid;

var crossdrawcount;
var crossdrawid;

var winlinedrawcount;
var winlinedrawid;

// Actual start of the code.
reset();
resetBoard(ctx);

canvas.addEventListener("click", (e) => {
    if (phase === "p") {
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        if (x < 133) {
            x = 0;
    } else if (x < 266) {
        x = 1;
    } else {
        x = 2;
    }
    if (y < 133) {
        y = 0;
    } else if (y < 266) {
        y = 1;
    } else {
        y = 2;
    }
    if (lignes[y][x] === 0) {
        lignes[y][x] = playerNum;
        if (playerNum === 1) {
            if (poscircle.push([x, y]) > 3) {
                lignes[poscircle[0][1]][poscircle[0][0]] = 0;
                poscircle.shift();
            }
        } else {
            if (poscross.push([x, y]) > 3) {
                lignes[poscross[0][1]][poscross[0][0]] = 0;
                poscross.shift();
            }
        }
        updateDisplay(x, y);
        isplayerwin = calcWin();
        console.log(isplayerwin);
        if (isplayerwin) {phase = "end"};
        if (playerNum === 1) {playerNum = 2;} else {playerNum = 1;}
    }
    }
});

function reset() {
    canvas.style.transform = `rotateY(0.25turn)`;
    setTimeout(() => {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                lignes[i][j] = 0;
            }
        }
        playerNum = 1;
        resetBoard(ctx);
        poscircle = [];
        poscross = [];
        phase = "p";
        canvas.style.transform = "rotate(0turn)";}, 500);
}

function resetBoard(context) {
    context.clearRect(0, 0, 400, 400);
    ctx.strokeStyle = "black";
    context.beginPath();
    context.moveTo(133, 0);
    context.lineTo(133, 400);
    context.lineWidth = 10;
    context.stroke();
    
    context.beginPath();
    context.moveTo(266, 0);
    context.lineTo(266, 400);
    context.lineWidth = 10;
    context.stroke();
    
    context.beginPath();
    context.moveTo(0, 133);
    context.lineTo(400, 133);
    context.lineWidth = 10;
    context.stroke();
    
    context.beginPath();
    context.moveTo(0, 266);
    context.lineTo(400, 266);
    context.lineWidth = 10;
    context.stroke();
}

function updateDisplay(animationX, animationY) {
    let animation;
    resetBoard(ctx);
    lignes.forEach((ligne, index) => {
        ligne.forEach ((value, index2) => {
            if (index === animationY && index2 === animationX) {
                animation = true;
            } else {
                animation = false;
            }
            if (value === 1) {
                drawCircle(index, index2, animation);
            } if (value === 2) {
                drawCross(index, index2, animation);
            }
        });
    });
    
}

function drawCircle(y, x, withanimation = false) {
    x = (400 /6) + 133 * x;
    y = 400/6 + 133 * y;
    ctx.moveTo(x + 50, y);
    if (withanimation) {
        circledrawcount = 0;
        circledrawid = setInterval(drawCirclePart, 10, x, y);
    } else {
        ctx.beginPath()
        ctx.strokeStyle = "blue";
        ctx.arc(x,y, 50, 0, Math.PI*2);
        ctx.stroke();
    }
}

function drawCirclePart(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 50, Math.PI*((circledrawcount-11)/170), Math.PI*(circledrawcount/170));
    ctx.strokeStyle = "blue";
    ctx.stroke();
    circledrawcount += 10;
    if (circledrawcount > 350) {
        clearInterval(circledrawid);
    }
}

function drawCross(y, x, withanimation = false) {
    x = (400 /6) + 133 * x;
    y = 400/6 + 133 * y;
    
    if (!withanimation) {
        ctx.beginPath();
        ctx.moveTo(x + 50, y + 50);
        ctx.lineTo(x-50, y-50);
        ctx.moveTo(x-50, y+50);
        ctx.lineTo(x+50, y-50);
        ctx.strokeStyle = "red";
        ctx.stroke();
    } else {
        crossdrawcount = 0;
        crossdrawid = setInterval(drawCrossPart1, 10, x, y)
    }
}

function drawCrossPart1(x, y) {
    ctx.beginPath();
    ctx.moveTo(x-51+crossdrawcount, y-51+crossdrawcount);
    ctx.lineTo(x-40+crossdrawcount, y-40+crossdrawcount);
    ctx.strokeStyle = "red";
    ctx.stroke();
    crossdrawcount += 10;
    if (crossdrawcount > 90) {
        clearInterval(crossdrawid);
        crossdrawcount = 0;
        crossdrawid = setInterval(drawCrossPart2, 10, x, y);
    }
}

function drawCrossPart2(x, y) {
    ctx.beginPath();
    ctx.moveTo(x+51-crossdrawcount, y-51+crossdrawcount);
    ctx.lineTo(x+40-crossdrawcount, y-40+crossdrawcount);
    ctx.strokeStyle = "red";
    ctx.stroke();
    crossdrawcount += 10;
    if (crossdrawcount > 90) {
        clearInterval(crossdrawid);
    }
}


function calcWin() {
    result = false;
    let listepos = [];
    if (playerNum === 1) {
        poscircle.forEach((element) => {
            listepos.push(element);
        });
    } else if (playerNum === 2) {
        poscross.forEach((element) => {
            listepos.push(element);
        });
    }

    if (listepos.length < 3) {return false;}
    
    console.log(listepos);
    listepos = sort(listepos);
    // Il faut maintenant effacer les 3 lignes en dessous en mettre la formule qui calcule si les trois trucs sont alignés.
    const dx = listepos[1][0] - listepos[0][0];
    const dy = listepos[1][1] - listepos[0][1];
    console.log(listepos);
    if (listepos[1][0] + dx === listepos[2][0] && listepos[1][1] + dy === listepos[2][1]) {
        result = true;
    }
    if (result) {
        setTimeout(drawLineWin, 200, listepos);
    }

    return result;
}

function drawLineWin(list) {
    const x = 400/3;
    let startpointx = list[0][0]*133.3;
    let startpointy = list[0][1]*133.3;
    let endpointx = list[2][0]*133.3;
    let endpointy = list[2][1]*133.3;

    if (startpointx === endpointx) {
        startpointx += 400/6;
        endpointx += 400/6;
        endpointy = 400;
    }

    if (startpointy === endpointy) {
        startpointy += 400/6;
        endpointy += 400/6;
        endpointx = 400;
    }

    if (startpointx !== endpointx && startpointy !== endpointy) {
        endpointy = 400;
        if (startpointx === 0) {
            endpointx = 400;
        } else {
            startpointx = 400;
        }
    }

    ctx.beginPath();
    const numberoftime = 20;
    const dx = (endpointx-startpointx)/numberoftime;
    const dy = (endpointy-startpointy)/numberoftime;
    winlinedrawcount = 0;
    console.log(dx);
    console.log(dy);
    winlinedrawid = setInterval(drawLineWinPart, 20, startpointx, startpointy, dx, dy, numberoftime);
}

function drawLineWinPart(x, y, dx, dy, numberofit) {
    ctx.moveTo(x+dx*winlinedrawcount, y+dy*winlinedrawcount);
    ctx.lineTo(x+dx*(winlinedrawcount+1), y+dy*(winlinedrawcount+1));
    ctx.stroke();
    winlinedrawcount++;
    if (winlinedrawcount > numberofit) {
        clearInterval(winlinedrawid);
    }

}

// On va trier les élements en fonction de y d'abord et ensuite de x.
function sort(list) {
    let result = [];
    list.forEach((element) => {
        if (result.length < 1) {
            result.push(element);
        } else {
            console.log(result.length);
            //on essaie de le mettre tout devant ou éventuellement au millieu :
            for (let i = 0; i < result.length; i++) {
                console.log("i :")
                console.log(i);
                if (element[1] < result[i][1]) {
                    result.splice(i, 0, element);
                    break;
                } else if (element[1] === result[i][1] && element[0] < result[i][0]) {
                    result.splice(i, 0, element);
                    break;
                }
            }
            // Et après on essaie de voir si on met l'élement tout derrière.
            if (element[1] > result[result.length-1][1]) {
                result.push(element);
            } else if (element[1] === result[result.length-1][1] && element[0] > result[result.length-1][0]) {
                result.push(element);
            }
        }
        console.log(result);
    });
    return result;
}