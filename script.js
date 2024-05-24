let canvas = document.getElementById("canvas");
        let desenho = canvas.getContext("2d");

        let setaDireita1 = false;
        let setaEsquerda1 = false;
        let setaDireita2 = false;
        let setaEsquerda2 = false;

        let rebatedorAltura = 10;
        let rebatedorLargura = 70;

        let rebatedor1X = (canvas.width / 2 - rebatedorLargura) / 2;
        let rebatedor2X = (canvas.width / 2 - rebatedorLargura) / 2 + canvas.width / 2;

        let bolaRadius = 15;
        let bola1X = canvas.width / 4;
        let bola1Y = canvas.height - rebatedorAltura - bolaRadius;
        let bola1DX = 6;
        let bola1DY = -2;

        let bola2X = 3 * canvas.width / 4;
        let bola2Y = canvas.height - rebatedorAltura - bolaRadius;
        let bola2DX = 6;
        let bola2DY = -2;

        let tijolosPorLinha = 6;
        let tijolosPorColuna = 6;
        let tijoloLargura = 80;
        let tijoloAltura = 40;
        let tijoloPadding = 10;
        let tijoloOffsetTop = (canvas.height - (tijolosPorColuna * (tijoloAltura + tijoloPadding))) / 3;
        let tijoloOffsetLeft = (canvas.width / 2 - (tijolosPorLinha * (tijoloLargura + tijoloPadding))) / 2;
        let tijolos1 = [];
        let tijolos2 = [];

        for (let c = 0; c < tijolosPorColuna; c++) {
            tijolos1[c] = [];
            tijolos2[c] = [];
            for (let r = 0; r < tijolosPorLinha; r++) {
                tijolos1[c][r] = { x: 0, y: 0, status: 1 };
                tijolos2[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

        document.addEventListener("keydown", descerTecla);
        document.addEventListener("keyup", subirTecla);

        function descerTecla(tecla) {
            if (tecla.key == "Right" || tecla.key == "ArrowRight") {
                setaDireita1 = true;
            } else if (tecla.key == "Left" || tecla.key == "ArrowLeft") {
                setaEsquerda1 = true;
            } else if (tecla.key == "d" || tecla.key == "D") {
                setaDireita2 = true;
            } else if (tecla.key == "a" || tecla.key == "A") {
                setaEsquerda2 = true;
            }
        }

        function subirTecla(tecla) {
            if (tecla.key == "Right" || tecla.key == "ArrowRight") {
                setaDireita1 = false;
            } else if (tecla.key == "Left" || tecla.key == "ArrowLeft") {
                setaEsquerda1 = false;
            } else if (tecla.key == "d" || tecla.key == "D") {
                setaDireita2 = false;
            } else if (tecla.key == "a" || tecla.key == "A") {
                setaEsquerda2 = false;
            }
        }

        function desenharRebatedor(x, isLeft) {
            desenho.beginPath();
            desenho.rect(x, canvas.height - rebatedorAltura, rebatedorLargura, rebatedorAltura);
            desenho.fillStyle = isLeft ? "green" : "blue";
            desenho.fill();
            desenho.closePath();
        }

        function desenharBola(x, y, isLeft) {
            desenho.beginPath();
            desenho.arc(x, y, bolaRadius, 0, Math.PI * 2);
            desenho.fillStyle = isLeft ? "red" : "purple";
            desenho.fill();
            desenho.closePath();
        }

        function desenharTijolos(tijolos, offsetX) {
            for (let c = 0; c < tijolosPorColuna; c++) {
                for (let r = 0; r < tijolosPorLinha; r++) {
                    if (tijolos[c][r].status == 1) {
                        let tijoloX = (r * (tijoloLargura + tijoloPadding)) + tijoloOffsetLeft + offsetX;
                        let tijoloY = (c * (tijoloAltura + tijoloPadding)) + tijoloOffsetTop;
                        tijolos[c][r].x = tijoloX;
                        tijolos[c][r].y = tijoloY;
                        desenho.beginPath();
                        desenho.rect(tijoloX, tijoloY, tijoloLargura, tijoloAltura);
                        desenho.fillStyle = "gray";
                        desenho.fill();
                        desenho.closePath();
                    }
                }
            }
        }

        function desenharDivisor() {
            desenho.beginPath();
            desenho.moveTo(canvas.width / 2, 0);
            desenho.lineTo(canvas.width / 2, canvas.height);
            desenho.strokeStyle = "black";
            desenho.stroke();
            desenho.closePath();
        }

        function colisao(bolaX, bolaY, bolaDX, bolaDY, tijolos) {
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
            return bolaDY;
        }

        function desenhar() {
            desenho.clearRect(0, 0, canvas.width, canvas.height);

            desenharRebatedor(rebatedor1X, true);
            desenharRebatedor(rebatedor2X, false);

            desenharBola(bola1X, bola1Y, true);
            desenharBola(bola2X, bola2Y, false);

            desenharTijolos(tijolos1, 0);
            desenharTijolos(tijolos2, canvas.width / 2);

            desenharDivisor();

            bola1DY = colisao(bola1X, bola1Y, bola1DX, bola1DY, tijolos1);
            bola2DY = colisao(bola2X, bola2Y, bola2DX, bola2DY, tijolos2);

            if (bola1X + bola1DX > canvas.width / 2 - bolaRadius || bola1X + bola1DX < bolaRadius) {
                bola1DX = -bola1DX;
            }

            if (bola1Y + bola1DY < bolaRadius) {
                bola1DY = -bola1DY;
            } else if (bola1Y + bola1DY > canvas.height - bolaRadius) {
                if (bola1X > rebatedor1X && bola1X < rebatedor1X + rebatedorLargura) {
                    bola1DY = -bola1DY;
                } else {
                    document.location.reload();
                }
            }

            if (bola2X + bola2DX > canvas.width - bolaRadius || bola2X + bola2DX < canvas.width / 2 + bolaRadius) {
                bola2DX = -bola2DX;
            }

            if (bola2Y + bola2DY < bolaRadius) {
                bola2DY = -bola2DY;
            } else if (bola2Y + bola2DY > canvas.height - bolaRadius) {
                if (bola2X > rebatedor2X && bola2X < rebatedor2X + rebatedorLargura) {
                    bola2DY = -bola2DY;
                } else {
                    document.location.reload();
                }
            }

            if (setaDireita1 && rebatedor1X < canvas.width / 2 - rebatedorLargura) {
                rebatedor1X += 7;
            } else if (setaEsquerda1 && rebatedor1X > 0) {
                rebatedor1X -= 7;
            }

            if (setaDireita2 && rebatedor2X < canvas.width - rebatedorLargura) {
                rebatedor2X += 7;
            } else if (setaEsquerda2 && rebatedor2X > canvas.width / 2) {
                rebatedor2X -= 7;
            }

            bola1X += bola1DX;
            bola1Y += bola1DY;

            bola2X += bola2DX;
            bola2Y += bola2DY;

            requestAnimationFrame(desenhar);
        }

        desenhar();