const PathFinder = require("./solvers/shortest_path/path_finder.js");
const MazeView = require("./view/shortest_path/maze_view.js");

$(()=> {
  const $el = $(".viewer");
  const pathFinder = new PathFinder();
  new MazeView(pathFinder, $el);
})
