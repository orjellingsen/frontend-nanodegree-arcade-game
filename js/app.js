// Enemies that the player needs to avoid
var Enemy = function(x, y) {
    this.sprite = 'images/enemy-bug.png'; // Enemy sprite
    this.x = (x * 101) - 110; // Offset x-coordinate to make bug start outside screen
    if (y === 1) {
        this.y = y * 81;
    } else if (y === 2) {
        this.y = y * 81;
    } else if (y === 3) {
        this.y = y * 81;
    }
    this.speed = Math.floor((Math.random() * 6) + 2); // Random number between 2-4 to determine enemy speed
    this.collisionWidth = 40;
    this.collisionHeight = 20;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt, player) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x > 510) { // If enemy goes outside screen, reset to the left side and change its speed
        this.x = -110; 
        this.speed = Math.floor((Math.random() * 6) + 2);
    }
    this.x += this.speed; // If enemy is in the screen, set its movement speed
    this.checkCollision(player);
    
};

Enemy.prototype.checkCollision = function(player) {
    if (Math.abs(player.x - this.x) < this.collisionWidth && Math.abs(player.y - this.y) < this.collisionHeight) {
        player.updateScore('collision');
        player.reset();
    }
}

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

// Player class
var Player = function(x, y) {
    this.sprite = 'images/char-boy.png'; // Player sprite
    this.x = x * 101; // Starting position
    this.y = y * 81;
    this.speed = 4; // Player speed
    this.score = 0; // Player score starts at 0
    this.highScore = this.score;
    this.direction = false;
};

// Update player's position
Player.prototype.update = function(dt) {
    // If the player reaches the water, add score and reset player
    if (this.y < 1) {
        this.reset();
        this.updateScore('water');
    }
    // Change direction based on the input receieved and make sure player don't exit screen
    if (this.direction === 'up' && this.y > 0) {
        this.y -= this.speed;
    } else if (this.direction === 'down'  && this.y < 405) {
        this.y += this.speed;
    } else if (this.direction === 'left'  && this.x > 0) {
        this.x -= this.speed;
    } else if (this.direction === 'right' && this.x < 405) {
        this.x += this.speed;
    }
};

Player.prototype.updateScore = function(condition) {
    ctx.font = '18px Impact';
    ctx.fillStyle = "#fff";
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

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.updateScore();
};

// Reset player to original position and add score
Player.prototype.reset = function() {
    this.x = 2 * 101;
    this.y = 5 * 81;
    this.direction = false;
};

// Handle the input to move the player
Player.prototype.handleInput = function(key) {
    this.direction = key; // Change player.direction based on the key pressed
};

// Instantiate objects
var allEnemies = [new Enemy(0,1), new Enemy(0,2), new Enemy(0,3)];
var player = new Player(2, 5);

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
