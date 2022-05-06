var gameArea = {
    canvas : document.createElement("canvas"),

    start : function() {
        this.canvas.width = 1080;
        this.canvas.height = 720;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        this.gravity = 1.25;

        this.interval = setInterval(updateGameArea, 20);

        window.addEventListener('keydown', function(e) {
            gameArea.keys = (gameArea.keys || []);
            gameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function(e) {
            gameArea.keys[e.keyCode] = false;
        })
    },

    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

var player;
var leftCollide, rightCollide;
var topCollide, bottomCollide;

var surfaces = [];

function startGame() {
    gameArea.start();

    player = new component(50, 100, "purple", 240, 220, 0, "object");
    player.ySpeed = 0;
    leftCollide = new component(10, 75, "rgba(0, 0, 0, 0)", 50, 50, 0, "obsticle");
    rightCollide = new component(10, 75, "rgba(0, 0, 0, 0)", 50, 50, 0, "obsticle");
    topCollide = new component(50, 10, "rgba(0, 0, 0, 0)", 50, 50, 0, "obsticle");
    bottomCollide = new component(50, 10, "rgba(0, 0, 0, 0)", 50, 50, 0, "obsticle");

    surfaces[0] = new component(1080, 50, "blue", 0, 670, 0, "obsticle");
    surfaces[1] = new component(50, 150, "blue", 0, 520, 0, "obsticle");
    surfaces[2] = new component(50, 150, "blue", 1030, 520, 0, "obsticle");
    surfaces[3] = new component(300, 50, "blue", 390, 500, 0, "obsticle");
}

function component(width, height, color, x, y, angle, type) {
    this.width = width;
    this.height = height;

    this.x = x;
    this.y = y;
    this.angle = angle;

    this.speed = 0;
    this.ySpeed = 1;
    this.xSpeed = 1;
    this.rotSpeed = 0;

    this.jumpCount = 0;

    if(type == "player") {
        this.image = new Image();
        this.image.src = color;
    }

    this.update = function() {
        if(type == "obsticle") {
            ctx = gameArea.context;
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else {
            ctx = gameArea.context;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            if(type == "player") {
                ctx.drawImage(this.image, this.width / -2, this.height / -2, this.width, this.height);
            } else {
                ctx.fillStyle = color;
                ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
            }
            ctx.restore();
        }
    }

    this.newPlayerPosition = function() {
        for(i=0; i < surfaces.length; i++) {
            if(leftCollide.collideWith(surfaces[i])) {
                if(this.xSpeed < 0) {
                    this.xSpeed = 0;
                    console.log("Boom");
                }
                
                console.log("Crash");
            }

            if(rightCollide.collideWith(surfaces[i])) {
                if(this.xSpeed > 0) {
                    this.xSpeed = 0;
                    console.log("Boom");
                }
                
                console.log("Crash");
            }
        }

        for(i=0; i < surfaces.length; i++) {
            if(topCollide.collideWith(surfaces[i])) {
                if(this.ySpeed < 0) {
                    this.ySpeed = 0;
                }
            }
            
            if(bottomCollide.collideWith(surfaces[i])) {
                if(this.ySpeed > 0) {
                    this.ySpeed = 0;
                    this.y = surfaces[i].y -50;
                }

                this.jumpCount = 0;
            }
        }

        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    this.collideWith = function(otherObj) {
        var left = this.x;
        var right = this.x + (this.width);
        var top = this.y;
        var bottom = this. y + (this.height);

        var otherLeft = otherObj.x;
        var otherRight = otherObj.x + (otherObj.width);
        var otherTop = otherObj.y;
        var otherBottom = otherObj.y + (otherObj.height);

        var collide = true;

        if((bottom < otherTop) || (top > otherBottom) || (right < otherLeft) || (left > otherRight)) {
            collide = false;
        }

        return collide;
    }
}

function updateGameArea() {
    gameArea.clear();

    player.xSpeed = 0;
    if(gameArea.keys && gameArea.keys[39]) {
        player.xSpeed = 10;
    }
    if(gameArea.keys && gameArea.keys[37]) {
        player.xSpeed = -10;
    }
    if(gameArea.keys && gameArea.keys[90] && (player.jumpCount == 0)) {
        player.ySpeed = -20;
        player.jumpCount += 1;
    }

    player.ySpeed += gameArea.gravity;

    player.newPlayerPosition();
    player.update();

    leftCollide.x = player.x - 35;
    leftCollide.y = player.y - 50;
    leftCollide.update();

    rightCollide.x = player.x + 25;
    rightCollide.y = player.y - 50;
    rightCollide.update();

    topCollide.x = player.x -25;
    topCollide.y = player.y - 60;
    topCollide.update();
    
    bottomCollide.x = player.x -25;
    bottomCollide.y = player.y + 50;
    bottomCollide.update();

    for(i=0; i < surfaces.length; i++) {
        surfaces[i].update();
    }
}