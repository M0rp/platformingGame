var gameArea = {
    canvas : document.createElement("canvas"),

    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        this.frameSincePlayer1Fire = 50;
        this.frameSincePlayer2Fire = 50;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

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
var floor;

function startGame() {
    gameArea.start();

    player = new component(50, 100, "purple", 240, 220, 0, "object");
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

    this.newPos = function() {
        this.angle += this.rotSpeed * Math.PI / 180;
        
        this.x += this.speed * Math.sin(this.angle);
        this.y += -this.speed * Math.cos(this.angle);
    }

    this.newPlayerPos = function(top, right, bottom, left) {
        this.angle += this.rotSpeed * Math.PI / 180;

        var speedX = this.speed * Math.sin(this.angle);
        var speedY = -this.speed * Math.cos(this.angle);

        // this.x += this.speed * Math.sin(this.angle);
        // this.y += -this.speed * Math.cos(this.angle);

        if(top.collideWith(vertWall1) || top.collideWith(vertWall2) || top.collideWith(horWall1) || top.collideWith(horWall2)) {
            if(speedY < 0) {
                speedY = 0;
            }
        }

        if(right.collideWith(vertWall1) || right.collideWith(vertWall2) || right.collideWith(horWall1) || right.collideWith(horWall2)) {
            if(speedX > 0) {
                speedX = 0;
            }
        }

        if(bottom.collideWith(vertWall1) || bottom.collideWith(vertWall2) || bottom.collideWith(horWall1) || bottom.collideWith(horWall2)) {
            if(speedY > 0) {
                speedY = 0;
            }
        }

        if(left.collideWith(vertWall1) || left.collideWith(vertWall2) || left.collideWith(horWall1) || left.collideWith(horWall2)) {
            if(speedX < 0) {
                speedX = 0;
            }
        }

        this.x += speedX;
        this.y += speedY;
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

    this.topCollide = function(otherObj) {
        var top = this.y - (this.height/2);

        var otherLeft = otherObj.x;
        var otherRight = otherObj.x + (otherObj.width);
        var otherTop = otherObj.y;
        var otherBottom = otherObj.y + (otherObj.height);

        var collide = true;
        if((top < otherTop) || (top > otherBottom) || (top < otherLeft) || (top > otherRight)) {
            collide = false;
        }
        console.log(collide);
        return collide;
    }
}

function updateGameArea() {
    gameArea.clear();

    if(gameArea.keys) {
        console.log(gameArea.keys);
    }

    player.update();
}