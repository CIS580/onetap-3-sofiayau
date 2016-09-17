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
