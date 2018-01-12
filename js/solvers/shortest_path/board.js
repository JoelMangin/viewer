"use strict"

const Grid = require("./grid.js");

function Board(maze = null){
  this.gridObj = new Grid(maze);
  this.grid = this.gridObj.grid;
  this.startExitPos = this.gridObj.startExitPos;
};

Board.prototype.inBoard = function(pos){
  let x = pos[0];
  let y = pos[1];
  return Number.isInteger(x) && Number.isInteger(y) && 0 <= x && x < 8 && 0 <= y && y < 16;

};

Board.prototype.getValue = function(pos){
  if(this.inBoard(pos)){
    let x = pos[0];
    let y = pos[1];
    return this.grid[x][y] ;
  }
};

Board.prototype.validNeighbour = function(neighbPos){
  let value = this.getValue(neighbPos);
  return value === " " || value === "E";
};

Board.prototype.nextPosistions = function(pos){
  let x = pos[0];
  let y = pos[1];
  return [[x-1, y], [x+1, y], [x, y-1], [x, y+1]];
}

Board.prototype.neighbours = function(pos){
    let validPositions = []
    let positions = this.nextPosistions(pos);
    positions.forEach( neighbPos => {
      if(this.validNeighbour(neighbPos)){
        validPositions.push(neighbPos);
      }
    })
    return validPositions;
}


module.exports = Board;
