const EMPTY =0;
const OBSTACLE=1;
const AGENT =2;
const BOUNDARY =3;


let graph = [];
let maze_flag = false;
let clear_flag = false;
let onClickFlag = "maze";
let place = () => { };
let agents = [];
const HEIGHT = 500; //pixels
const WIDTH = 950; //pixels
const mazeHeight = 31; //units
const mazeWidth = 51; //units
const mazeHeightUnit = HEIGHT / mazeHeight; // pixels/unit
const mazeWidthUnit = WIDTH / mazeWidth; // pixels/unit
const maze_generation_algos = {
    'rh': RandomizedHorizontals,
    'rv': RandomizedVerticals,
    'rd': RecursiveDivision
}
// function to initialize the maze and the grid
function initGrid(p5) {
    graph = []

    for (let i = 0; i < mazeHeight; i++) {
        var row = [];
        for (let j = 0; j < mazeWidth; j++) {
            if (
                i === 0 ||
                j === 0 ||
                i === mazeHeight - 1 ||
                j === mazeWidth - 1
            ) {
                row.push(BOUNDARY);
                p5.fill(47, 56, 56); // border obstacles
            } else {
                p5.fill(255); // maze bg color
                row.push(EMPTY);
            }
            p5.rect(
                mazeWidthUnit * j,
                mazeHeightUnit * i,
                mazeWidthUnit,
                mazeHeightUnit
            );
        }
        graph.push(row);
    }
}

// function to calculate the index on the grid from the x and y coordinate on the screen
const calculateIndex = (X, Y) => {
    let j = parseInt(X / mazeWidthUnit);
    let i = parseInt(Y / mazeHeightUnit);
    return [i, j];
};

// function to animate the placing of mazes and update the grid array
const animateMazeWalls = (p5, order) => {
    clearSketch(p5);
    for (let i = 0; i < order.length; i++) {
        setTimeout(() => {
            placeMazeWall(p5, order[i]);
        }, 0);
    }
};

// function to clear the entire grid to scratch
const clearSketch = p5 => {
    initGrid(p5);
};

// function to colour a box with a given index (i,j) and colour (r,g,b)
const colourBox = (p5, index, fillValue) => {
    let i = index[0],
        j = index[1];
    if (typeof fillValue === "number") {
        p5.fill(fillValue);
    } else {
        p5.fill(fillValue[0], fillValue[1], fillValue[2]);
    }
    p5.rect(
        mazeWidthUnit * j,
        mazeHeightUnit * i,
        mazeWidthUnit,
        mazeHeightUnit
    );
};

// function to place maze wall
const placeMazeWall = (p5, index) => {
    if (graph[index[0]][index[1]] === EMPTY) {
        graph[index[0]][index[1]] = OBSTACLE;
        colourBox(p5, index, [47, 56, 56]);
    } else if (graph[index[0]][index[1]] === OBSTACLE) {
        graph[index[0]][index[1]] = EMPTY;
        colourBox(p5, index, 255);
    }
};
const placeAgentStart=(p5,index)=>{
    if (graph[index[0]][index[1]] === EMPTY) {
        graph[index[0]][index[1]] = AGENT;
        colourBox(p5, index, [255,0,0]);
    } else if (graph[index[0]][index[1]] === AGENT) {
        graph[index[0]][index[1]] = EMPTY;
        colourBox(p5, index, 255);
    }
}

// function to place maze wall on click
const placeMazeWallOnClick = p5 => {
    let index = calculateIndex(p5.mouseX, p5.mouseY);

    if (
        index[0] < mazeHeight &&
        index[0] >= 0 &&
        index[1] < mazeWidth &&
        index[1] >= 0
    ) {
        placeMazeWall(p5, index);
    }

    place = () => { };
};
// place agent on Click
const placeAgentOnClick = p5 => {
    let index = calculateIndex(p5.mouseX, p5.mouseY);

    if (
        index[0] < mazeHeight &&
        index[0] >= 0 &&
        index[1] < mazeWidth &&
        index[1] >= 0
    ) {
        placeAgentStart(p5, index);
    }

    place = () => { };
};

// decides on click function based on the global flag
// the global flag is decided from the buttons
const onTouchFunctions = {
    "maze":placeMazeWallOnClick,
    "agent":placeAgentOnClick
}


function sketchMainMaze(p5) {
    p5.setup = function () {
        p5.createCanvas(WIDTH, HEIGHT);
        p5.background(220);
        initGrid(p5);
    }
    p5.draw = function () {
        // stuff to draw
        place(p5);   
        // if the navbar communicates to generate a maze 
        if (clear_flag) {
            clearSketch(p5);
            clear_flag = false;
        }

        if (maze_flag) {
            selected_maze_generation_algo = document.getElementById('maze-generation-algo').value

            let mazeOrder = maze_generation_algos[selected_maze_generation_algo](graph)
            if (mazeOrder) {
                animateMazeWalls(p5, mazeOrder);
                maze_flag = false;
            }
        }
    }

    // p5js inbuilt method to detect screen touches
    p5.touchStarted = () => {
        place = onTouchFunctions[onClickFlag];
    };
}

new p5(sketchMainMaze, 'main-maze')
