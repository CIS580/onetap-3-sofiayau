(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* Classes */
const Game = require('./game');
const EntityManager = require('./entity-manager');
const Player = require('./player');
const Snake = require('./snake');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
game.entities = new EntityManager(128);
var player = new Player({x: 382, y: 440});
var snakes = [];
for(var i=0; i < 20; i++) {
  snakes.push(new Snake({
    x: Math.random() * 760,
    y: Math.random() * 40 + 100
  }));
  entities.add(snakes[i]);
}
snakes.sort(function(s1,s2){return s1.y - s2.y;});

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  player.update(elapsedTime);
  snakes.forEach(function(snake) { snake.update(elapsedTime);});
  entities.collide(function(entity1,entity2){
    entity1.color = 'red';
    entity2.color = 'red';
  });
  // TODO: Update the game objects
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */

  //bucket id = x / 2(int)  leftSide
  //bucket id =(x+w) / 2 (int) rightside

function render(elapsedTime, ctx) {
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  snakes.forEach(function(snake){snake.render(elapsedTime, ctx);});
  player.render(elapsedTime, ctx);
}

},{"./entity-manager":2,"./game":3,"./player":4,"./snake":5}],2:[function(require,module,exports){
module.exports = exports = EntityManager;

function EntityManager(width, height, cellSize){
  this.worldWidth = width;
  this.worldHeight = height;
  this.cellSize = cellSize;
  this.widthInCells = Math.ceil(width / cellSize);
  this.numberOfCells = this.widthInCells * Math.ceil(height / cellSize);
  this.cells = [];
  for(var i =0; i < this.numberOfCells; i++){
    this.cells[i] = [];
  }
}

EntityManager.prototype.addEntity = function(entity){
  var x = Math.floor(entity.x / this.cellSize);
  var y = Math.ceil((entity.x+ entity.width)/this.cellSize);
  var index = y * this.widthInCells + x;
  this.cells[index].push(entity);
    entity._cell = index;
  }


  /*var top = Math.floor(entity.y / this.cellSize);
  var bottom = Math.ceil((entity.y+ entity.height)/this.cellSize);
  for(var x = left; x < right; x++){
    for(var y = top;y < bottom; y++){
      this.cells[y * this.widthInCells + x].push(entity);
      if(!entity.cells) entity.cells = [];
      entity.cells.push({x: x, y:y});
    }
  }*/

EntityManager.prototype.updateEntity = function(entity){
  var x = Math.floor(entity.x / this.cellSize);
  var y = Math.ceil((entity.x+ entity.width)/this.cellSize);
  var index = y * this.widthInCells + x;
  if(index != entity._cell){
    var cellIndex = this.cells[entity._cell].indexOf(entity);
    if(cellIndex != -1)this.cells[entity._cell].splice(cellIndex,1);
    this.cell[index].push(entity);
    entity._cell = index;
  }
}

//remove entity
EntityManager.prototype.collide = function(callback){
  var self = this;
  this.cells.forEach(function(cell,i) {
    cell.forEach(function(entity1){
      cell.forEach(function(entity2){
        if(entity1 != entity2) checkForCollision(entity1,entity2,callback);
      });
      if(i % (self.widthInCells - 1) != 1){
        self.cells[i+1].forEach(function(entity2){
          checkForCollision(entity1,entity2, callback);
        });
      }
      if(i < self.numberOfCells - self.widthInCells){
        self.cellls[i + self.widthInCells].forEach(function(entity2){
          checkForCollision(entity1,entity2,callback);
        });
      }
      //check for collisions diagionally below and right
      if(i < self.numberOfCells - self.widthInCells || i % (self.widthInCells - 1)!= 0){
        self.cells[i + self.widthInCells +1].forEach(function(entity2){
          checkForCollision(entity1,entity2,callback);
        });
      }
    });
  });
}
function checkForCollision(entity1,entity2,callback){
  var collides = !(entity1.x +entity1.width < entity2.x ||
                  entity1.x < entity2.x +entity2.width ||
                  entity1.y +entity1.height < entity2.y ||
                  entity2.y < entity2.height +entity2.y);
  if(collides){
    callback(entity1,entity2);
  }
}

},{}],3:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],4:[function(require,module,exports){
"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
  this.state = "waiting";
  this.frame = 0;
  this.timer = 0;
  this.x = position.x;
  this.y = position.y;
  this.width  = 16;
  this.height = 16;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/link/not link/notlink up.png');

  var self = this;
  window.onmousedown = function(event) {
    if(self.state == "waiting") {
      self.x = event.clientX;
      self.state = "walking";
    }
  }
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(elapsedTime) {
  this.timer += elapsedTime;
  switch(this.state) {
    case "walking":
      if(this.timer > 1000/16) {
        this.frame = (this.frame + 1) % 4;
        this.timer = 0;
      }
      this.y -= 1;
      break;
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  ctx.drawImage(
    // image
    this.spritesheet,
    // source rectangle
    this.frame * this.width, 0, this.width, this.height,
    // destination rectangle
    this.x, this.y, 2*this.width, 2*this.height
  );
}

},{}],5:[function(require,module,exports){
"use strict";

/**
 * @module exports the Snake class
 */
module.exports = exports = Snake;

/**
 * @constructor Snake
 * Creates a new snake object
 * @param {Postition} position object specifying an x and y
 */
function Snake(position) {
  this.state = (Math.random() > 0.5) ? "left" : "right";
  this.frame = 0;
  this.timer = 0;
  this.x = position.x;
  this.y = position.y;
  this.width  = 16;
  this.height = 16;
  this.leftBound = position.x - 20;
  this.rightBound = position.x + 20;
  this.color ;
}

/** Declare spritesheet at the class level */
Snake.prototype.leftSpritesheet = new Image();
Snake.prototype.leftSpritesheet.src = 'assets/fang/fang left.png';
Snake.prototype.rightSpritesheet = new Image();
Snake.prototype.rightSpritesheet.src = 'assets/fang/fang right.png';

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Snake.prototype.update = function(elapsedTime) {
  this.timer += elapsedTime;
  if(this.timer > 1000/6) {
    this.frame = (this.frame + 1) % 4;
    this.timer = 0;
  }
  switch(this.state) {
    case "left":
      this.x -= 0.5;
      if(this.x < this.leftBound) this.state = "right";
      break;
    case "right":
      this.x += 0.5;
      if(this.x > this.rightBound) this.state = "left";
      break;
  }
  this.color = '#00000000';
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Snake.prototype.render = function(time, ctx) {
  if(this.state == "right") {
    ctx.drawImage(
      // image
      this.leftSpritesheet,
      // source rectangle
      this.frame * this.width, 0, this.width, this.height,
      // destination rectangle
      this.x, this.y, 2*this.width, 2*this.height
    );
  } else {
    ctx.drawImage(
      // image
      this.rightSpritesheet,
      // source rectangle
      this.frame * this.width, 0, this.width, this.height,
      // destination rectangle
      this.x, this.y, 2*this.width, 2*this.height
    );
  }
  ctx.strokeStyle = this.color;
  ctx.strokeRect(this.x, this.y, this.width, this.height);
}

},{}]},{},[1]);
