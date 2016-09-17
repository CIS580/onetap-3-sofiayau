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
