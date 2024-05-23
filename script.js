let canvas = document.getElementById("canvas");
let desenho = canvas.getContext("2d");

let setaDireita = false;
let setaEsquerda = false;

let rebatedorAltura = 10;
let rebatedorLargura = 70;
let rebatedorX = (canvas.width - rebatedorLargura) / 2;

let bolaRadius = 15;
let bolaX = canvas.width / 2;
let bolaY = canvas.height - rebatedorAltura - bolaRadius;
let bolaDX = 6;
let bolaDY = -2;

let tijolosPorLinha = 13;
let tijolosPorColuna = 4;
let tijoloLargura = 80;
let tijoloAltura = 40; 
let tijoloPadding = 10;
let tijoloOffsetTop = (canvas.height - (tijolosPorColuna * (tijoloAltura + tijoloPadding))) / 3; 
let tijoloOffsetLeft = (canvas.width - (tijolosPorLinha * (tijoloLargura + tijoloPadding))) / 2; 
let tijolos = [];

for (let c = 0; c < tijolosPorColuna; c++) {
    tijolos[c] = [];
    for (let r = 0; r < tijolosPorLinha; r++) {
        tijolos[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", descerTecla);
document.addEventListener("keyup", subirTecla);

function descerTecla(tecla) {
    if (tecla.key == "Right" || tecla.key == "ArrowRight") {
        setaDireita = true;
    } else if (tecla.key == "Left" || tecla.key == "ArrowLeft") {
        setaEsquerda = true;
    }
}

function subirTecla(tecla) {
    if (tecla.key == "Right" || tecla.key == "ArrowRight") {
        setaDireita = false;
    } else if (tecla.key == "Left" || tecla.key == "ArrowLeft") {
        setaEsquerda = false;
    }
}

function desenharRebatedor() {
    desenho.beginPath();
    desenho.rect(rebatedorX, canvas.height - rebatedorAltura, rebatedorLargura, rebatedorAltura);
    desenho.fillStyle = "green";
    desenho.fill();
    desenho.closePath();
}

function desenharBola() {
    desenho.beginPath();
    desenho.arc(bolaX, bolaY, bolaRadius, 0, Math.PI * 2);
    desenho.fillStyle = "red";
    desenho.fill();
    desenho.closePath();
}

function desenharTijolos() {
    for (let c = 0; c < tijolosPorColuna; c++) {
        for (let r = 0; r < tijolosPorLinha; r++) {
            if (tijolos[c][r].status == 1) {
                let tijoloX = (r * (tijoloLargura + tijoloPadding)) + tijoloOffsetLeft;
                let tijoloY = (c * (tijoloAltura + tijoloPadding)) + tijoloOffsetTop;
                tijolos[c][r].x = tijoloX;
                tijolos[c][r].y = tijoloY;
                desenho.beginPath();
                desenho.rect(tijoloX, tijoloY, tijoloLargura, tijoloAltura);
                desenho.fillStyle = "blue";
                desenho.fill();
                desenho.closePath();
            }
        }
    }
}

function colisao() {
    for (let c = 0; c < tijolosPorColuna; c++) {
        for (let r = 0; r < tijolosPorLinha; r++) {
            let t = tijolos[c][r];
            if (t.status == 1) {
                if (bolaX > t.x && bolaX < t.x + tijoloLargura && bolaY > t.y && bolaY < t.y + tijoloAltura) {
                    bolaDY = -bolaDY;
                    t.status = 0;
                }
            }
        }
    }
}

function desenhar() {
    desenho.clearRect(0, 0, canvas.width, canvas.height);
    desenharRebatedor();
    desenharBola();
    desenharTijolos();
    colisao(); // Check for collision with bricks

    if (bolaX + bolaDX > canvas.width - bolaRadius || bolaX + bolaDX < bolaRadius) {
        bolaDX = -bolaDX;
    }

    if (bolaY + bolaDY < bolaRadius) {
        bolaDY = -bolaDY;
    } else if (bolaY + bolaDY > canvas.height - bolaRadius) {
        if (bolaX > rebatedorX && bolaX < rebatedorX + rebatedorLargura) {
            bolaDY = -bolaDY;
        } else {
            document.location.reload();
        }
    }

    if (setaDireita && rebatedorX < canvas.width - rebatedorLargura) {
        rebatedorX += 7;
    } else if (setaEsquerda && rebatedorX > 0) {
        rebatedorX -= 7;
    }

    bolaX += bolaDX;
    bolaY += bolaDY;

    requestAnimationFrame(desenhar);
}

desenhar();