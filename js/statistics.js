// Statistics for Maze X (x: agent, y:cost/time)
var selected_maze = "Maze X"

var cost = [
    { x: 1, y: 7 },
    { x: 1, y: 7 },
    { x: 3, y: 8 },
    { x: 4, y: 9 },
    { x: 5, y: 9 },
    { x: 8, y: 11 },
];

var time = [
    { x: 2, y: 12 },
    { x: 2, y: 11.5 },
    { x: 2, y: 11 },
    { x: 6, y: 3 },
    { x: 7, y: 1 },
    { x: 9, y: 14 },
    { x: 10, y: 14 },
];

// Generate drop down for all saved mazes 
function getSavedMazes() {
    // TODO: Retrieve list of mazes from cloud DB
    var values = ['Maze 1', 'Maze 2', 'Maze 3', 'Maze 4']
 
    // Create drop down menu for saved mazes retrieved above
    var select = document.createElement("select");
    select.name = "maze_dropdown";
    select.id = "maze_dropdown"
 
    for (const val of values)
    {
        var option = document.createElement("option");
        option.value = val;
        option.text = val.charAt(0).toUpperCase() + val.slice(1);
        select.appendChild(option);
    }
 
    var label = document.createElement("label");
    label.innerHTML = "Choose saved maze: "
    label.htmlFor = "maze_dropdown";
 
    document.getElementById("select-maze-statistics").appendChild(label).appendChild(select);

}

// Get statistics for selected maze from drop down
function getStats() {
    // Get selected maze from drop down 
    var selected_maze = document.getElementById("maze_dropdown").value;

    // TODO: Retrieve statistics from cloud DB

  }

// Plot statistics on chart
new Chart("myChart", {
    type: "scatter",
    label: [], 
    data: {
        datasets: [{
            pointRadius: 4,
            pointBackgroundColor: "rgb(0, 71, 171)",
            borderColor: "rgb(0, 71, 171)",
            backgroundColor: "rgb(0, 71, 171)",
            data: cost,
            label: "Execution Cost",
        },
        {
            pointRadius: 4,
            pointBackgroundColor: "rgb(50,205,50)",
            borderColor: "rgb(50,205,50)",
            backgroundColor: "rgb(50,205,50)",
            data: time,
            label: "Execution Time"
        }],
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Execution Statistics for ' + selected_maze,
            },
        },
        legend: { display: true },
        scales: {
            
            x: {
                title: {
                    display: true,
                    text: 'Number of Agents'
                },
                min: 0,
                max: 15,
                ticks: {
                    stepSize: 1,
                  },
            },

            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Execution Cost/Time'
                },
                min: 0
            },
        },
    }
});