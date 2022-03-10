const EMPTY = 0;
const OBSTACLE = 1;
const AGENT = 2;
const BOUNDARY = 3;


let graph = [];
let maze_flag = false;
let clear_flag = false;
let visualise_solution_flag = false;
let onClickFlag = "maze";
let place = () => { };
let agentPositions = [];
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
    const numAgents = document.getElementById("numAgents").value;
    agentPositions = [];
    for (let i = 0; i < numAgents; i++) {
        agentPositions.push([false, false])
    }
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
    if (typeof fillValue === "number" || typeof fillValue === "string") {
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

const placeAgentStart = (p5, index) => {

    let agent_number = document.getElementById("agent_dropdown").value - 1;
    let agent_color = agent_colors[agent_number][0]

    if (graph[index[0]][index[1]] === EMPTY && !agentPositions[agent_number][0]) {
        graph[index[0]][index[1]] = AGENT;
        agentPositions[agent_number][0] = index;
        colourBox(p5, index, agent_color);
    } else if (graph[index[0]][index[1]] === AGENT && index[0] == agentPositions[agent_number][0][0] && index[1] == agentPositions[agent_number][0][1]) {
        graph[index[0]][index[1]] = EMPTY;
        agentPositions[agent_number][0] = false;
        colourBox(p5, index, 255);
    }
}

const placeAgentGoal = (p5, index) => {

    let agent_number = document.getElementById("agent_dropdown").value - 1;
    let agent_color = agent_colors[agent_number][1]

    if (graph[index[0]][index[1]] === EMPTY && !agentPositions[agent_number][1]) {
        graph[index[0]][index[1]] = AGENT;
        agentPositions[agent_number][1] = index;

        colourBox(p5, index, agent_color);
    } else if (graph[index[0]][index[1]] === AGENT && index[0] == agentPositions[agent_number][1][0] && index[1] == agentPositions[agent_number][1][1]) {
        graph[index[0]][index[1]] = EMPTY;
        agentPositions[agent_number][1] = false;
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
const placeAgentStartOnClick = p5 => {

    // set button as selected
    select_start_button = document.getElementById('select_start_button');
    select_start_button.classList.add("button-clicked");

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

// place agent on Click
const placeAgentEndOnClick = p5 => {

    let index = calculateIndex(p5.mouseX, p5.mouseY);

    if (
        index[0] < mazeHeight &&
        index[0] >= 0 &&
        index[1] < mazeWidth &&
        index[1] >= 0
    ) {
        placeAgentGoal(p5, index);
    }

    place = () => { };
};

// decides on click function based on the global flag
// the global flag is decided from the buttons
const onTouchFunctions = {
    "maze": placeMazeWallOnClick,
    "agent_start": placeAgentStartOnClick,
    "agent_end": placeAgentEndOnClick,

}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}



const visualiseMazeSolution = async (p5, mapfSolution) => {

    let maxLength = 0;
    // finding agent with longest path
    for (let key of Object.keys(mapfSolution)) {
        if (mapfSolution[key].length > maxLength) {
            maxLength = mapfSolution[key].length;
        }
    }

    // iterating through longest path
    for (let i = 1; i < maxLength - 1; i++) {
        // setTimeout(() => {
        // iterating through agents
        for (let key of Object.keys(mapfSolution)) {
            if (i < mapfSolution[key].length - 1) {
                colourBox(p5, mapfSolution[key][i], agent_colors[key - 1][0]);
            }
        }
        // }, 0);
        await delay(500);
    }

}

// making sure that the api call isn't made if input isn't correct
const validate = () => {
    let validatePositions = true;
    for (let i = 0; i < agentPositions.length; i++) {
        for (let j = 0; j < 2; j++) {
            validatePositions = validatePositions && agentPositions[i][j];
        }
    }
    if (!validatePositions) {
        alert("Select all start and end positions");
    }
    return validatePositions;
}

const formatApiBody = () => {
    // make a copy of graph
    let formattedMaze = JSON.parse(JSON.stringify(graph));

    // replace 2/3 with 0/1 respectively
    for (let i = 0; i < formattedMaze.length; i++) {
        for (let j = 0; j < formattedMaze[i].length; j++) {
            if (formattedMaze[i][j] == AGENT) {
                formattedMaze[i][j] = EMPTY;
            }
            else if (formattedMaze[i][j] == BOUNDARY) {
                formattedMaze[i][j] = OBSTACLE;
            }
        }
    }

    return { maze: formattedMaze, agent_positions: agentPositions }

}


function sketchMainMaze(p5) {
    p5.setup = function () {
        p5.createCanvas(WIDTH, HEIGHT);
        p5.background(220);
        initGrid(p5);
    }
    p5.draw = async function () {
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

        if (visualise_solution_flag) {
            visualise_solution_flag = false;
            // checks if all the input is valid
            if (validate()) {
                const apiBody = formatApiBody();
                // make api call
                // var myHeaders = new Headers();
                // myHeaders.append("Content-Type", "application/json");

                // var requestOptions = {
                //     method: 'POST',
                //     headers: myHeaders,
                //     body: JSON.stringify(apiBody),

                // };
                // fetch("https://r0izk68gbl.execute-api.ap-southeast-1.amazonaws.com/Stage/solve", requestOptions).then(response => response.json()).then(console.log).catch(error => console.log('error', error));

                const { mazeSolution, time, cost } = await api("POST", "solve", apiBody);
                console.log(mazeSolution);
                document.getElementById("execution-time").innerHTML = time;
                document.getElementById("execution-cost").innerHTML = cost;
                await visualiseMazeSolution(p5, mazeSolution);
            }
        }
    }

    // p5js inbuilt method to detect screen touches
    p5.touchStarted = () => {
        place = onTouchFunctions[onClickFlag];
    };

}

new p5(sketchMainMaze, 'main-maze')
