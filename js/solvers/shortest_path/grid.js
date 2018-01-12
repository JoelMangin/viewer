"use strict"

const Mazes = require("./maze.js")

function Grid(maze = null){
  let maze2 = maze === null ? this.selectMaze() : maze ;
  this.grid = this.buildMaze(maze2);
  this.startExitPos = this.findStartExit(this.grid);
}

Grid.prototype.selectMaze = function(){
  let index = Math.floor( Math.random() * 10);
  return Mazes[index];
}

Grid.prototype.buildMaze = function(maze){
  let grid = [];
  let index = 0;
  for(let count = 0; count < 8; count ++){
    let row = maze.slice(index, index + 16).split("");
    grid.push(row);
    index += 16;
  }
  return grid;
}

Grid.prototype.findStartExit = function(grid){
  let result = {};
  grid.forEach((row, rowIdx) =>{
    row.forEach((val, colIdx) => {
      if(val === "S"){
        result["S"] = [rowIdx, colIdx];
      } else if (val === "E"){
        result["E"] = [rowIdx, colIdx];
      }
    });
  })
  return result;
}

module.exports = Grid;
