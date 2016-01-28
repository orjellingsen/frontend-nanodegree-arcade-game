// Enemies that the player needs to avoid
var Enemy = function(x, y) {
    this.sprite = 'images/enemy-bug-red.png'; // Enemy sprite
    this.x = x - 110; // Offset x-coordinate to make bug start outside screen
    this.y = 60 + 85 * y; // Place the enemies in the correct lane based on y input
    this.randomSpeed(); // Call speed function to generate enemy speed
    this.collisionWidth = 50;
    this.collisionHeight = 45;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt, player) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // If enemy goes outside screen, reset to the left side and change its speed
    if (this.x > 707) {
        this.x = -110;
        this.randomSpeed(dt);
    }
    /* As long as the enemy is inside the screen, move it along 
     * the x-axis and check for collisions on each update */
    this.x += this.speed;
    this.checkCollision(player);
};

Enemy.prototype.checkCollision = function(player) {
    if (Math.abs(player.x - this.x) < this.collisionWidth && Math.abs(player.y - this.y) < this.collisionHeight) {
        // Update score and reset player
        player.updateScore('collision');
        player.reset();
    }
};

Enemy.prototype.randomSpeed = function() {
    // Generate a random number to determine enemy speed
    this.speed = ((Math.floor((Math.random() * 8) + 2)));
    // Change appearance of enemy based on its speed
    if (this.speed > 3 && this.speed <= 5) {
        this.sprite = 'images/enemy-bug-green.png';
    } else if (this.speed > 5 && this.speed <= 7) {
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
    // Player sprite
    this.sprite = 'images/char-boy.png';
    this.startPos = {
        /* The x,y are coordinates of the game grid. 
         * Multiplied with the with and height of earch square */
        'x': x * 101,
        'y': y * 81
    };
    // Set player to the starting position
    this.reset();
    // Player movement speed
    this.speed = 6;
    // Starting score and highscore is set
    this.score = 0;
    this.highScore = this.score;
};

// Update player's position
Player.prototype.update = function(dt) {
    /* If the player reaches the top of the screen (water),
     * add score, level and reset player */
    if (this.y < 1) {
        this.updateScore('water');
        this.reset();
    }
    /* Change direction based on the input receieved,
     * and make sure player don't exit screen */
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
    // Styling for the score display
    ctx.font = '18px Verdana';
    ctx.fillStyle = "#fff";
    ctx.strokeWidth = 20;
    // Clear the display area before updating the score
    ctx.clearRect(0, 0, 500, 50);
    // Display the score and highscore
    this.scoreText = ctx.fillText('Score: ' + this.score, 400, 40);
    this.highScoreText = ctx.fillText('Highest Score: ' + this.highScore, 50, 40);
    // Increase and display score if player reaches the water
    if (condition === 'water') {
        this.score += 1;
        this.scoreText;
    // If the player collide with enemy, reset score and set new highscore
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
    this.updateScore(); // Show initial score
};

// Reset player to original position and add score
Player.prototype.reset = function() {
    this.x = this.startPos.x;
    this.y = this.startPos.y;
    this.direction = false; // Make the player stand still
};

// Handle the input to move the player
Player.prototype.handleInput = function(key) {
    // Change player.direction based on the key pressed
    this.direction = key;
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
    // If an allowed key was pressed, send it to the handleInput function
    player.handleInput(allowedKeys[e.keyCode]);
});