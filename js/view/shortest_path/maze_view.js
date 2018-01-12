"use strict"

const PathFinder = require("./../../solvers/shortest_path/path_finder.js");

function MazeView(pathFinder, el){
  this.time = 0;
  this.pathFinder = pathFinder;
  this.$main = el;

  this.$li = $(".shortest-path");
  this.$li.on("click", this.handleClick.bind(this));

  this.handlePath = this.handlePath.bind(this);
  this.handleClick = this.handleClick.bind(this);
}

MazeView.prototype.handleClick = function(){
  this.cleanDisplay();
  this.selectNewMaze();
  this.buildMaze();
  this.buildMenu();
}

MazeView.prototype.selectNewMaze = function(){
  this.pathFinder = new PathFinder();
}


MazeView.prototype.cleanDisplay = function(){
  let $section = $(".maze");
  $section.remove();
  let $menu = $(".menu");
      $menu.remove();
  let $p = $("p");
      $p.remove();
}

MazeView.prototype.buildMaze = function(){
  let $maze = $("<section></section>");
      $maze.addClass("maze");
  this.pathFinder.board.grid.forEach((row, rowIdx) => {
    let $ul = $("<ul></ul>");
        $ul.addClass("ul-rowIdx");
    row.forEach((value, colIdx) => {
      let $li = $("<li></li>");
      this.updateClass($li, value, rowIdx, colIdx);
      $ul.append($li);
    })
    $maze.append($ul);
  });
  this.$main.append($maze);
}

MazeView.prototype.updateClass = function(li, value, rowIdx, colIdx){
  li.addClass(`ul-${rowIdx}-${colIdx}`);
  switch(value){
    case "*":
      li.addClass("wall");
      break;
    case "E":
      li.addClass("end");
      li.html("E");
      break;
    case "S":
      li.addClass("start");
      li.html("S");
      break;
    default:
      li.addClass("free");
  }
}

MazeView.prototype.buildMenu = function(){
  let $ul = $("<ul></ul>");
      $ul.addClass("menu");
  this.buildButton("Find Path!", this.handlePath, $ul);
  this.buildButton("New Grid!", this.handleClick, $ul);
  this.$main.append($ul);
}

MazeView.prototype.buildButton = function(buttonVal, callBack, ul){
  let $button = $("<button></button>");
  $button.html(`${buttonVal}`);
  $button.on('click', function(event){
    event.preventDefault();
    callBack(event);
  });
  ul.append($button);
}

MazeView.prototype.handlePath = function(){
  let $lis = $(".path");
      $lis.remove();
  let start = new Date();
  let pathPositions = this.pathFinder.findShortestPath();
  let end = new Date();
  this.time = end.getTime() - start.getTime();
  pathPositions.forEach(pos => {
    let $li = this.getLi(pos);
        $li.addClass("path");
  });
  this.blockFindPath();
  this.buildTime();
}

MazeView.prototype.getLi = function(pos){
  let row = pos[0];
  let col = pos[1];
  let $li = $(`.ul-${row}-${col}`);
  return $li;
}

MazeView.prototype.blockFindPath = function(){
  let $button = $("button:contains(Find Path!)");
      $button.prop("disabled", true);
}

MazeView.prototype.buildTime = function(){
  let $p = $("<p></p>");
  $p.html(`Time to find path: ${this.time} ms.`);
  let $section = $(".maze");
  $section.append($p);
}

module.exports = MazeView;
