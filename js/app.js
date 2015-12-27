// Enemies that the player needs to avoid
var Enemy = function(x, y) {
    this.sprite = 'images/enemy-bug-red.png'; // Enemy sprite
    this.x = x - 110; // Offset x-coordinate to make bug start outside screen
    this.y = 60 + 85 * y;
    this.randomSpeed(); // Random number between 2-4 to determine enemy speed
    this.collisionWidth = 50;
    this.collisionHeight = 45;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt, player) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x > 707) { // If enemy goes outside screen, reset to the left side and change its speed
        this.x = -110; 
        this.randomSpeed();
    }
    this.x += this.speed; // If enemy is in the screen, set its movement speed
    this.checkCollision(player);
    
};

Enemy.prototype.checkCollision = function(object) {
    if (Math.abs(object.x - this.x) < this.collisionWidth && Math.abs(object.y - this.y) < this.collisionHeight) {
        object.updateScore('collision');
        object.reset();
    }
}

Enemy.prototype.randomSpeed = function() {
    this.speed = Math.floor((Math.random() * 8) + 4);
    if (this.speed > 3 && this.speed < 5) {
        this.sprite = 'images/enemy-bug-green.png';
    } else if (this.speed > 5 && this.speed < 7) {
        this.sprite = 'images/enemy-bug-yellow.png';
    } else if (this.speed > 7) {
        this.sprite = 'images/enemy-bug-blue.png';
    } else {
        this.sprite = 'images/enemy-bug-red.png';
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

// Player class
var Player = function(x, y) {
    this.sprite = 'images/char-princess-girl.png'; // Player sprite
    this.startPos = { 
        'x': x * 101,
        'y': y * 81
    };
    this.x = this.startPos.x; // Starting position
    this.y = this.startPos.y;
    this.speed = 6; // Player speed
    this.score = 0; // Player score starts at 0
    this.highScore = this.score;
    this.direction = false;
    this.level(Player);
};

// Update player's position
Player.prototype.update = function(dt) {
    // If the player reaches the water, add score, level and reset player
    if (this.y < 1) {
        this.level(Player);
        console.log(this.currentLevel);
        this.updateScore('water');
        this.reset();
    }
    // Change direction based on the input receieved and make sure player don't exit screen
    if (this.direction === 'up' && this.y > 0) {
        this.y -= this.speed;
    } else if (this.direction === 'down'  && this.y < 400) {
        this.y += this.speed;
    } else if (this.direction === 'left'  && this.x > 0) {
        this.x -= this.speed;
    } else if (this.direction === 'right' && this.x < 600) {
        this.x += this.speed;
    }
};

Player.prototype.updateScore = function(condition) {
    ctx.font = '18px Verdana';
    ctx.fillStyle = "#fff";
    ctx.strokeWidth = 20;
    ctx.clearRect(0, 0, 500, 50);
    this.scoreText = ctx.fillText('Score: ' + this.score, 400, 40);
    this.highScoreText = ctx.fillText('Highest Score: ' + this.highScore, 50, 40);
    if (condition === 'water') {
        this.score += 1;
        this.scoreText;
    } else if (condition === 'collision') {
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
        this.score = 0;
        this.scoreText;
    }
};

Player.prototype.level = function(player) {
    player.level = {
        1: [1,3],
        2: [2,4],
        3: [3,5],
        4: [4,6],
        5: [5,7],
        6: [6,8],
        7: [7,9],
        8: [8,10],
        9: [9,11],
        10: [10,12]
    }
    if (this.score === 1 ) {
        this.currentLevel = 1;
    } else if (this.score === 2) {
        this.currentLevel = 2;
    } else if (this.score === 3) {
        this.currentLevel = 3;
    } else if (this.score === 4) {
        this.currentLevel = 4;
    } else if (this.score === 5) {
        this.currentLevel = 5;
    } else if (this.score === 6) {
        this.currentLevel = 6;
    } else if (this.score === 7) {
        this.currentLevel = 7;
    } else if (this.score === 8) {
        this.currentLevel = 8;
    } else if (this.score === 9) {
        this.currentLevel = 9;
    } else if (this.score === 10) {
        this.currentLevel = 10;
    }
};

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.updateScore(); // Show initial score
};

// Reset player to original position and add score
Player.prototype.reset = function() {
    this.x = this.startPos.x;
    this.y = this.startPos.y;
    this.direction = false;
};

// Handle the input to move the player
Player.prototype.handleInput = function(key) {
    this.direction = key; // Change player.direction based on the key pressed
};

// Instantiate objects
var allEnemies = [new Enemy(0,0), new Enemy(0,1), new Enemy(0,2), new Enemy(0,3)];
var player = new Player(3, 5);

// Listen for key presses and send to player.handleInput()
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
