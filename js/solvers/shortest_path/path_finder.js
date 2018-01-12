"use strict"

const Board = require("./board.js");

function PathFinder(maze = null){
  this.board = new Board(maze);
  this.startExitPos = this.board.startExitPos;

  this.tree = {};
  let startPos = this.startExitPos["S"];
  this.tree[startPos] = null;
  this.currentPositions = [startPos];
  this.alreadySeenPos = [];
}

PathFinder.prototype.exploreCurrentPos = function(){
  let newCurrentPositions = [];
  this.currentPositions.forEach( pos => {
    this.alreadySeenPos.push(pos);
    this.board.neighbours(pos).forEach(neighbPos => {
      if(this.checkNotSeen(neighbPos)){
        newCurrentPositions.push(neighbPos);
        this.tree[neighbPos] = pos;
      }
    });
  });
  return newCurrentPositions;
}

PathFinder.prototype.checkNotSeen = function(pos){
  for(let index = 0; index < this.alreadySeenPos.length; index ++){
    let seenPos = this.alreadySeenPos[index];
    if(seenPos[0] === pos[0] && seenPos[1] === pos[1]){
      return false;
    }
  }
  return true;
}

PathFinder.prototype.buildTree = function(){
  let target = this.startExitPos["E"].toString();
  while (this.currentPositions.length !== 0 || !Object.keys(this.tree).includes(target)){
    this.currentPositions = this.exploreCurrentPos();
  }
};

PathFinder.prototype.findShortestPath = function(){

  this.buildTree();
  let currentElement = this.startExitPos["E"];
  let path = [];
  while (this.tree[currentElement] !== null) {
    this.update(currentElement, path);
    path.unshift(currentElement);
    currentElement = this.tree[currentElement];
  }
  return path;
}

PathFinder.prototype.update = function(currentElement, path){
  if( typeof currentElement === "string" ){
     currentElement = this.convertToPos(currentElement);
  }
}

PathFinder.prototype.convertToPos = function(posString){
  let arr = posString.split(",").map( val => parseInt(val));
  return arr;
}

module.exports = PathFinder;
