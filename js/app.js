// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = (x * 101) - 110; // Offset x-coordinate to make bug start outside screen
    if (y === 1) {
        this.y = y * 81;
    } else if (y === 2) {
        this.y = y * 81;
    } else if (y === 3) {
        this.y = y * 81;
    }
    this.speed = Math.floor((Math.random() * 4) + 2); // Random number between 2-4 to determine enemy speed
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
        this.speed = Math.floor((Math.random() * 4) + 2);
    } else {
        if (this.x === player.x && this.y === player.y) {
            player.reset();
        } else {
            this.x += this.speed; // If enemy is still in the screen, set its movement speed
            this.checkCollision(player);
        }
    }
};

Enemy.prototype.checkCollision = function(player) {
    if (Math.abs(player.x - this.x) < this.collisionWidth && Math.abs(player.y - this.y) < this.collisionHeight) {
        player.reset();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.sprite = 'images/char-boy.png';
    this.x = x * 101; // Starting position
    this.y = y * 81;
    this.speed = 2;
    this.score = 0; // Player score starts at 0
};

// Update player's position
Player.prototype.update = function(dt) {
    if (this.y < 0) {
        player.reset();
        this.score += 1; // Add one to score and reset player when it reaches the water
        console.log('Score: ' + this.score);
    }
};

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Reset player to original position
Player.prototype.reset = function() {
    this.x = 2 * 101;
    this.y = 5 * 81;
};

// Handle the input to move the player
Player.prototype.handleInput = function(key) {
    var logLoc = console.log('x: ' + this.x + ', y:' + this.y); // Log coordinates to console

    if (key === 'up' && this.y > 0) {
            this.y -= 83;
            logLoc;
    } else if (key === 'down' && this.y < 405) {
            this.y += 83;
            logLoc;
    } else if (key === 'left' && this.x > 0) {
        this.x -= 101;
        logLoc;
    } else if (key === 'right' && this.x < 304) {
        this.x += 101;
        logLoc;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(0,1), new Enemy(0,2), new Enemy(0,3)];
var player = new Player(2, 5);
//var enemy = new Enemy();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
    console.log('Key: ' + allowedKeys[e.keyCode]);
});
