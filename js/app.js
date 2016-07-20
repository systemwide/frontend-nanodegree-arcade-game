
//utility variables used by Player class
var player_startPos_x = 200;
var player_startPos_y = 435;
var player_max_x = 415;
var player_min_x = -10;
var lives = 3;


// utility variables used by Enemy class
var numEnemies = 5;
var enemySpeedBoost = 10;
var allEnemies = [];
var enemyXMax = 450;
var enemyXMin = -100;
var enemyYMax = 350;
var enemyYMin = 125;



// Enemies our player must avoid

var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = this.xStartPosition();
    this.y = this.yStartPosition();
    this.width = 75;
    this.height = 40;
    this.sprite = 'images/enemy-bug.png';
    this.speed = this.enemyRandomSpeed();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (this.speed * dt);
  
  // check to see if enemy is off edge of canvas
  // player class is responsbile for collision detection

  if (this.x >= 500) {
    this.reset();
  }
};


// reset enemy positions
Enemy.prototype.reset = function() {
    this.x = -100;
    this.y = this.yStartPosition();
    this.speed = this.enemyRandomSpeed();

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// function to determine enemy speed. Increases as score increases.
Enemy.prototype.enemyRandomSpeed = function() {

    var max = 115 + enemySpeedBoost;
    var min = 15 + enemySpeedBoost;

    return Math.floor(Math.random(max, min) * (max - min +1)) + min;
};

// function to determine enemy x start position
Enemy.prototype.xStartPosition = function() {

    return Math.floor(Math.random() * enemyXMax - enemyXMin + 1) + enemyXMin;
};

// function to determine enemy y start position
Enemy.prototype.yStartPosition = function() {

    return Math.floor(Math.random() * enemyYMax - enemyYMin + 1) + enemyYMin;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// ********************************************************************************************
// My Player constructor and supporting functions
// ********************************************************************************************

var Player = function() {
    this.x = player_startPos_x;
    this.y = player_startPos_y;
    this.width = 35;
    this.height = 55;
    this.sprite = 'images/char-boy.png';
    this.lives = lives;
};


// This is the collision detection function - algorithm adapted from the 2d Bounded Box section of
// http://blog.sklambert.com/html5-canvas-game-2d-collision-detection/

Player.prototype.detectCollision = function () {
    var collisionBool = false;
// loop through allEnemies to check for collision with player
    for(var i = 0; i < allEnemies.length; i++) {
        if(this.x < allEnemies[i].x + allEnemies[i].width && this.x + this.width > allEnemies[i].x &&
            this.y < allEnemies[i].y + allEnemies[i].height && this.y + this.height > allEnemies[i].y)
            collisionBool = true;
    }
    return collisionBool;
};


// keep player from "falling off" the game board
Player.prototype.keepOnScreen = function(){
    if(this.x < player_min_x) {
        this.x = player_min_x;
    }

    if(this.x > player_max_x) {
        this.x = player_max_x;
    }

    if(this.y > player_startPos_y) {
        this.y = player_startPos_y;
    }

};

// reset player sprite to start position if killed or successful
Player.prototype.reset = function() {
    this.x = player_startPos_x;
    this.y = player_startPos_y;
};



// update status of player sprite
Player.prototype.update = function() {
    
    if(this.y < 0) {
        this.reset();
        this.lives++;
        enemySpeedBoost = enemySpeedBoost + 10;

    }

    if(this.detectCollision()) {
        this.reset();
        this.lives--;
        enemySpeedBoost = enemySpeedBoost - 10;
    }
    
    this.keepOnScreen();
};

// Added text to render function - clearRect removes old text each time function is called
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.clearRect(15, 25, 100, 25);
    ctx.font = "24px Arial";
    ctx.fillText("Lives: " + this.lives, 15, 45);
};


// input handling adapted from various posts on the FEND forums
Player.prototype.handleInput = function (arrowKey) {
  if (arrowKey === 'up') { 
    this.y = this.y - 65;
        if (this.y < 80) {
            player.reset;
        }
    }
  if (arrowKey === 'down') { this.y = this.y + 61; }
  if (arrowKey === 'left') { this.x = this.x - 51; }
  if (arrowKey === 'right') { this.x = this.x + 51; }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
for (i = 0; i < numEnemies; i++) {
  allEnemies.push(new Enemy(i));
};

var player = new Player();


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
});
