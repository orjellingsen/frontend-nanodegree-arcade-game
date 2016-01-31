// Enemies that the player needs to avoid
var Enemy = function(x, y) {
	// Enemy sprite
	this.sprite = 'images/enemy-bug-red.png';
	// Offset x-coordinate to make bug start outside screen
	this.x = x - 110;
	// Place the enemies in the correct lane based on y input
	this.y = 60 + 85 * y;
	// Set the height and width of an invisible box for collision detection
	this.collisionWidth = 50;
	this.collisionHeight = 45;
	// Set speed to false, so Enemy.update know to set the speed first time
	this.speed = false;
};

/* Update the enemy's position
 * Parameter: dt, a time delta between ticks */
Enemy.prototype.update = function(dt, player) {
	// If speed is not set, generate random speed
	if(!this.speed) {
		this.randomSpeed(dt);
	}
	// If enemy goes outside screen, reset to the left side and change its speed
	if (this.x > 707) {
		this.x = -110;
		this.randomSpeed(dt);
	}
	/* As long as the enemy is inside the screen, move it along
	 * the x-axis and check for collisions on each update */
	this.x += (this.speed * dt);
	this.checkCollision(player);
};

Enemy.prototype.checkCollision = function(player) {
	if (Math.abs(player.x - this.x) < this.collisionWidth && Math.abs(player.y - this.y) < this.collisionHeight) {
		// Update score and reset player
		player.updateScore('collision');
		player.reset();
	}
};

Enemy.prototype.randomSpeed = function(dt) {
	// Generate a random number to determine enemy speed
	this.speed = Math.floor((Math.random() * 400) + 100);
	console.log(this.speed);
	// Change appearance of enemy based on its speed
	if (this.speed > 150 && this.speed <= 250) {
		this.sprite = 'images/enemy-bug-green.png';
	} else if (this.speed > 250 && this.speed <= 350) {
		this.sprite = 'images/enemy-bug-yellow.png';
	} else if (this.speed > 350) {
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
	this.speed = 300;
	// Starting score and highscore is set
	this.score = 0;
	this.highScore = this.score;
};

// Update player's position
Player.prototype.update = function(dt) {
	/* If the player reaches the top of the screen (water),
	 * add score and reset player location */
	if (this.y < 1) {
		this.updateScore('water');
		this.reset();
	}
	/* Change direction based on the input receieved,
	 * and make sure player don't exit screen.
	 * Speed is multiplied by dt to make speed same gamespeed
	 * across computers */
	if (this.direction === 'up' && this.y > 0) {
		this.y -= this.speed * dt;
	} else if (this.direction === 'down'  && this.y < 400) {
		this.y += this.speed * dt;
	} else if (this.direction === 'left'  && this.x > 0) {
		this.x -= this.speed * dt;
	} else if (this.direction === 'right' && this.x < 600) {
		this.x += this.speed * dt;
	}
};

// Display score and highscore in the canvas
Player.prototype.displayScore = function() {
	// Styling for the score display
	ctx.font = '18px Verdana';
	ctx.fillStyle = "#fff";
	ctx.strokeWidth = 20;
	// Clear the display area before updating the score
	ctx.clearRect(0, 0, 500, 50);
	// Display the score and highscore
	this.scoreText = ctx.fillText('Score: ' + this.score, 400, 40);
	this.highScoreText = ctx.fillText('Highest Score: ' + this.highScore, 50, 40);
};

// Update or reset score based on condition
Player.prototype.updateScore = function(condition) {
	// Increase and display score if player reaches the water
	if (condition === 'water') {
		this.score += 1;
		player.displayScore();
	// If the player collide with enemy, reset score and set new highscore
	} else if (condition === 'collision') {
		if (this.score > this.highScore) {
			this.highScore = this.score;
		}
		this.score = 0;
		player.displayScore();
	}
};

// Draw the player on the screen
Player.prototype.render = function() {
	// Draw player sprite at the starting position
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	// Show initial score
	this.displayScore();
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