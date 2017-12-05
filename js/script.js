'use strict'

var CONST = {
    ANIMATION_TIMER : 20,
    REPLAY_INTERVAL : 2000,
}

function canvasApp(oCanvas) {
    this.timer = -1,
        this.directionChngCount = 0,
        this.isPlaying = false,
        this.isHorizDir = true;

    this.oCanvas = oCanvas;
    this.oContext = oCanvas.getContext('2d');

    this.initialPos = {
        "X": 0,
        "Y": 0,
        "DELTA_X": 10,
        "DELTA_Y": 10
    };
    this.initialSize = {
        "WIDTH": 55,
        "HEIGHT": 55
    };
    this.rectangleMovingArea = {
        "x": 0,
        "y": 0,
        "width": this.oCanvas.clientWidth,
        "height": this.oCanvas.clientHeight
    };

    this.play();
}

canvasApp.prototype.moveRect = function () {
    this.isPlaying = true;
    this.drawCanvas();
    this.setRectPos();
}

canvasApp.prototype.play = function () {
    if (this.isPlaying) {
        return;
    }
    this.timer = window.setInterval(this.moveRect.bind(this), CONST.ANIMATION_TIMER);
    this.moveRect();
}

canvasApp.prototype.pause = function () {
    this.isPlaying = false;
    window.clearInterval(this.timer);
}

canvasApp.prototype.reset = function () {
    this.pause();

    this.directionChngCount = 0;

    this.initialPos.X = 0,
        this.initialPos.Y = 0,
        this.initialPos.DELTA_X = 10,
        this.initialPos.DELTA_Y = 10;

    this.rectangleMovingArea.x = 0,
        this.rectangleMovingArea.y = 0,
        this.rectangleMovingArea.width = this.oCanvas.clientWidth,
        this.rectangleMovingArea.height = this.oCanvas.clientHeight;
}

canvasApp.prototype.drawCanvas = function () {
    this.oContext.clearRect(0, 0, this.oContext.canvas.width, this.oContext.canvas.height);

    this.oContext.beginPath();
    this.oContext.rect(0, 0, this.oCanvas.width, this.oCanvas.height);
    this.oContext.fillStyle = "#FFFFCA";
    this.oContext.closePath();
    this.oContext.fill();

    this.oContext.fillStyle = "RED";
    this.oContext.beginPath();
    this.oContext.rect(this.initialPos.X, this.initialPos.Y, this.initialSize.WIDTH, this.initialSize.HEIGHT);
    this.oContext.closePath();
    this.oContext.fill();
}

canvasApp.prototype.setRectPos = function () {

    if (((this.initialPos.X + this.initialSize.WIDTH) >= this.rectangleMovingArea.width
        || (this.initialPos.X + this.initialPos.DELTA_X < this.rectangleMovingArea.x)
        && this.directionChngCount % 4 !== 0)
        && this.isHorizDir) {

        this.initialPos.DELTA_X = -this.initialPos.DELTA_X;
        this.directionChngCount++;
        this.isHorizDir = false;
    }
    else if (((this.initialPos.Y + this.initialSize.HEIGHT) >= this.rectangleMovingArea.height
        || this.initialPos.Y + this.initialPos.DELTA_Y < this.rectangleMovingArea.y)
        && !this.isHorizDir) {

        this.initialPos.DELTA_Y = -this.initialPos.DELTA_Y;
        this.directionChngCount++;
        this.isHorizDir = true;
    }

    if (this.isHorizDir) {
        this.initialPos.X += this.initialPos.DELTA_X;
    }
    else {
        this.initialPos.Y += this.initialPos.DELTA_Y;
    }

    if (this.directionChngCount % 4 === 3
        && this.initialPos.Y - (this.rectangleMovingArea.y + this.initialSize.HEIGHT) <= 0) {

        this.isHorizDir = true;
        this.directionChngCount++;

        this.reduceRectangleMovingArea();
        if (this.rectangleMovingArea.x >= this.rectangleMovingArea.width
            || this.rectangleMovingArea.y >= this.rectangleMovingArea.height) {
            this.reset();
            this.timer = window.setTimeout(this.play.bind(this), CONST.REPLAY_INTERVAL);
        }
    }
}

canvasApp.prototype.reduceRectangleMovingArea = function () {
    this.rectangleMovingArea.width -= this.initialSize.WIDTH;
    this.rectangleMovingArea.height -= this.initialSize.HEIGHT;
    this.initialPos.Y = this.rectangleMovingArea.y + this.initialSize.HEIGHT;

    this.rectangleMovingArea.x += this.initialSize.WIDTH;
    this.rectangleMovingArea.y += this.initialSize.HEIGHT;
    this.initialPos.DELTA_Y = -this.initialPos.DELTA_Y;
}

window.onload = function () {
    var oContainer = document.getElementById("canvas-container");
    var oCanvas = document.createElement("canvas");

    var btnPlay = document.getElementById('play');
    var btnPause = document.getElementById('pause');

    oCanvas.height = 694;
    oCanvas.width = 694;

    oContainer.appendChild(oCanvas);

    var oCanvasApp = new canvasApp(oCanvas);

    btnPlay.addEventListener('click', oCanvasApp.play.bind(oCanvasApp));
    btnPause.addEventListener('click', oCanvasApp.pause.bind(oCanvasApp));
}