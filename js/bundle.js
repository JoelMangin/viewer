/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Board = __webpack_require__(2);

function PathFinder() {
  var maze = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  this.board = new Board(maze);
  this.startExitPos = this.board.startExitPos;

  this.tree = {};
  var startPos = this.startExitPos["S"];
  this.tree[startPos] = null;
  this.currentPositions = [startPos];
  this.alreadySeenPos = [];
}

PathFinder.prototype.exploreCurrentPos = function () {
  var _this = this;

  var newCurrentPositions = [];
  this.currentPositions.forEach(function (pos) {
    _this.alreadySeenPos.push(pos);
    _this.board.neighbours(pos).forEach(function (neighbPos) {
      if (_this.checkNotSeen(neighbPos)) {
        newCurrentPositions.push(neighbPos);
        _this.tree[neighbPos] = pos;
      }
    });
  });
  return newCurrentPositions;
};

PathFinder.prototype.checkNotSeen = function (pos) {
  for (var index = 0; index < this.alreadySeenPos.length; index++) {
    var seenPos = this.alreadySeenPos[index];
    if (seenPos[0] === pos[0] && seenPos[1] === pos[1]) {
      return false;
    }
  }
  return true;
};

PathFinder.prototype.buildTree = function () {
  var target = this.startExitPos["E"].toString();
  while (this.currentPositions.length !== 0 || !Object.keys(this.tree).includes(target)) {
    this.currentPositions = this.exploreCurrentPos();
  }
};

PathFinder.prototype.findShortestPath = function () {

  this.buildTree();
  var currentElement = this.startExitPos["E"];
  var path = [];
  while (this.tree[currentElement] !== null) {
    this.update(currentElement, path);
    path.unshift(currentElement);
    currentElement = this.tree[currentElement];
  }
  return path;
};

PathFinder.prototype.update = function (currentElement, path) {
  if (typeof currentElement === "string") {
    currentElement = this.convertToPos(currentElement);
  }
};

PathFinder.prototype.convertToPos = function (posString) {
  var arr = posString.split(",").map(function (val) {
    return parseInt(val);
  });
  return arr;
};

module.exports = PathFinder;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var PathFinder = __webpack_require__(0);
var MazeView = __webpack_require__(5);

$(function () {
  var $el = $(".viewer");
  var pathFinder = new PathFinder();
  new MazeView(pathFinder, $el);
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Grid = __webpack_require__(3);

function Board() {
  var maze = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  this.gridObj = new Grid(maze);
  this.grid = this.gridObj.grid;
  this.startExitPos = this.gridObj.startExitPos;
};

Board.prototype.inBoard = function (pos) {
  var x = pos[0];
  var y = pos[1];
  return Number.isInteger(x) && Number.isInteger(y) && 0 <= x && x < 8 && 0 <= y && y < 16;
};

Board.prototype.getValue = function (pos) {
  if (this.inBoard(pos)) {
    var x = pos[0];
    var y = pos[1];
    return this.grid[x][y];
  }
};

Board.prototype.validNeighbour = function (neighbPos) {
  var value = this.getValue(neighbPos);
  return value === " " || value === "E";
};

Board.prototype.nextPosistions = function (pos) {
  var x = pos[0];
  var y = pos[1];
  return [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
};

Board.prototype.neighbours = function (pos) {
  var _this = this;

  var validPositions = [];
  var positions = this.nextPosistions(pos);
  positions.forEach(function (neighbPos) {
    if (_this.validNeighbour(neighbPos)) {
      validPositions.push(neighbPos);
    }
  });
  return validPositions;
};

module.exports = Board;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Mazes = __webpack_require__(4);

function Grid() {
  var maze = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  var maze2 = maze === null ? this.selectMaze() : maze;
  this.grid = this.buildMaze(maze2);
  this.startExitPos = this.findStartExit(this.grid);
}

Grid.prototype.selectMaze = function () {
  var index = Math.floor(Math.random() * 10);
  return Mazes[index];
};

Grid.prototype.buildMaze = function (maze) {
  var grid = [];
  var index = 0;
  for (var count = 0; count < 8; count++) {
    var row = maze.slice(index, index + 16).split("");
    grid.push(row);
    index += 16;
  }
  return grid;
};

Grid.prototype.findStartExit = function (grid) {
  var result = {};
  grid.forEach(function (row, rowIdx) {
    row.forEach(function (val, colIdx) {
      if (val === "S") {
        result["S"] = [rowIdx, colIdx];
      } else if (val === "E") {
        result["E"] = [rowIdx, colIdx];
      }
    });
  });
  return result;
};

module.exports = Grid;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Mazes = ["*****************         *   E** * **  ***  ****    *    *    ****  ** ***    **    *    ***  **S   * *       *****************", "*****************              **   **  ***  ****    *  **S    ****  ******    **    *    ***  **E             *****************", "*****************              **    *  ***  ****    **E**     *** ********    **    *S   ***  **              *****************", "*****************S        *   E**   **  * *  ****        **    **    ** * *    **         ***  **    * *       *****************", "*****************E             ************* **** *            ** * **  * *    ** *   ***********             S*****************", "*****************              **      E       **              **              **      S       **              *****************", "*****************              **      E       **              ** ************ **      S       **              *****************", "*****************              **      *       **  E   *   S   **      *       **      *       **              *****************", "*****************     E*S      **      *       **      *       **      *       **      *       **              *****************", "*****************             S**              ** ***************              **              **             E*****************"];

module.exports = Mazes;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var PathFinder = __webpack_require__(0);

function MazeView(pathFinder, el) {
  this.time = 0;
  this.pathFinder = pathFinder;
  this.$main = el;

  this.$li = $(".shortest-path");
  this.$li.on("click", this.handleClick.bind(this));

  this.handlePath = this.handlePath.bind(this);
  this.handleClick = this.handleClick.bind(this);
}

MazeView.prototype.handleClick = function () {
  this.cleanDisplay();
  this.selectNewMaze();
  this.buildMaze();
  this.buildMenu();
};

MazeView.prototype.selectNewMaze = function () {
  this.pathFinder = new PathFinder();
};

MazeView.prototype.cleanDisplay = function () {
  var $section = $(".maze");
  $section.remove();
  var $menu = $(".menu");
  $menu.remove();
  var $p = $("p");
  $p.remove();
};

MazeView.prototype.buildMaze = function () {
  var _this = this;

  var $maze = $("<section></section>");
  $maze.addClass("maze");
  this.pathFinder.board.grid.forEach(function (row, rowIdx) {
    var $ul = $("<ul></ul>");
    $ul.addClass("ul-rowIdx");
    row.forEach(function (value, colIdx) {
      var $li = $("<li></li>");
      _this.updateClass($li, value, rowIdx, colIdx);
      $ul.append($li);
    });
    $maze.append($ul);
  });
  this.$main.append($maze);
};

MazeView.prototype.updateClass = function (li, value, rowIdx, colIdx) {
  li.addClass("ul-" + rowIdx + "-" + colIdx);
  switch (value) {
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
};

MazeView.prototype.buildMenu = function () {
  var $ul = $("<ul></ul>");
  $ul.addClass("menu");
  this.buildButton("Find Path!", this.handlePath, $ul);
  this.buildButton("New Grid!", this.handleClick, $ul);
  this.$main.append($ul);
};

MazeView.prototype.buildButton = function (buttonVal, callBack, ul) {
  var $button = $("<button></button>");
  $button.html("" + buttonVal);
  $button.on('click', function (event) {
    event.preventDefault();
    callBack(event);
  });
  ul.append($button);
};

MazeView.prototype.handlePath = function () {
  var _this2 = this;

  var $lis = $(".path");
  $lis.remove();
  var start = new Date();
  var pathPositions = this.pathFinder.findShortestPath();
  var end = new Date();
  this.time = end.getTime() - start.getTime();
  pathPositions.forEach(function (pos) {
    var $li = _this2.getLi(pos);
    $li.addClass("path");
  });
  this.blockFindPath();
  this.buildTime();
};

MazeView.prototype.getLi = function (pos) {
  var row = pos[0];
  var col = pos[1];
  var $li = $(".ul-" + row + "-" + col);
  return $li;
};

MazeView.prototype.blockFindPath = function () {
  var $button = $("button:contains(Find Path!)");
  $button.prop("disabled", true);
};

MazeView.prototype.buildTime = function () {
  var $p = $("<p></p>");
  $p.html("Time to find path: " + this.time + " ms.");
  var $section = $(".maze");
  $section.append($p);
};

module.exports = MazeView;

/***/ })
/******/ ]);