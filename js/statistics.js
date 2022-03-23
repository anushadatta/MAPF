let scatterChart;
let lineChartTime;
let lineChartCost;
let statsData;

function updateStats() {
    if (scatterChart) {
        scatterChart.destroy();
    }
    if (lineChartTime) {
        lineChartTime.destroy();
    }
    if (lineChartCost) {
        lineChartCost.destroy();
    }
    let cost = [];
    let time = [];
    const mazeFilter = document.getElementById("stats_maze_dropdown").value;
    const heuristicFilter = document.getElementById("stats_heuristic").value;

    var mazeNameEle = document.getElementById("stats_maze_dropdown");
    var mazeName = mazeNameEle.options[mazeNameEle.selectedIndex].text;

    const MAX_NUM_AGENTS = 15;

    let labels = [];
    for (let i = 0; i < MAX_NUM_AGENTS; i++) {
        labels.push(i + 1);
    }
    const heuristics = ["no_heuristic", "manhattan_heuristic", "chebyshev_heuristic", "euclidian_heuristic"];
    const chartDataJson = {};
    for (let j = 0; j < heuristics.length; j++) {

        let lineTime = [];
        let lineCost = [];
        let lineAgentFrequency = [];
        for (let i = 0; i < MAX_NUM_AGENTS; i++) {
            lineTime.push(0);
            lineCost.push(0);
            lineAgentFrequency.push(0);
        }
        chartDataJson[heuristics[j]] = {
            lineTime,
            lineCost,
            lineAgentFrequency
        }
    }


    for (let i = 0; i < statsData.length; i++) {
        const { execution_cost, execution_time, agents_count, maze_id, lower_level_solver } = statsData[i];

        let boolResultMaze = mazeFilter == "All" || maze_id == mazeFilter;
        let boolResultHeuristic = heuristicFilter == "All" || lower_level_solver == heuristicFilter;
        // console.log(statsData["lower_level_solver"])
        // console.log(boolResultMaze, boolResultHeuristic)
        if (boolResultMaze) {
            // lineTime[]
            chartDataJson[lower_level_solver]["lineTime"][agents_count - 1] = parseFloat(execution_time);
            chartDataJson[lower_level_solver]["lineCost"][agents_count - 1] = execution_cost;
            chartDataJson[lower_level_solver]["lineAgentFrequency"][agents_count - 1] += 1;
            if (boolResultHeuristic) {
                time.push({ x: agents_count, y: execution_time });
                cost.push({ x: agents_count, y: execution_cost });
            }
        }
    }

    console.log("stats data", statsData);

    // Plot statistics on scatterChart
    scatterChart = new Chart("scatter-chart", {
        type: "scatter",
        label: [],
        data: {
            datasets: [
                {
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
                    label: "Execution Time",
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Execution Statistics for " + mazeName,
                },
            },
            legend: { display: true },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Number of Agents",
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
                        text: "Execution Cost/Time",
                    },
                    min: 0,
                },
            },
        },
    });
    const colors = ['rgb(75, 192, 192)', 'purple', '#006600', '#FFD707']
    let datasetTime = [];
    let datasetCost = [];
    for (let j = 0; j < heuristics.length; j++) {
        let datasetRecordTime = {
            fill: false,
            borderColor: colors[j],
            tension: 0.1
        };
        let datasetRecordCost = {
            fill: false,
            borderColor: colors[j],
            tension: 0.1
        };
        const currHeuristic = heuristics[j];
        datasetRecordTime.label = currHeuristic;
        datasetRecordCost.label = currHeuristic;
        for (let i = 0; i < MAX_NUM_AGENTS; i++) {
            if (chartDataJson[currHeuristic]["lineAgentFrequency"][i] != 0) {
                chartDataJson[currHeuristic]["lineTime"][i] /= chartDataJson[currHeuristic]["lineAgentFrequency"][i]
                chartDataJson[currHeuristic]["lineCost"][i] /= chartDataJson[currHeuristic]["lineAgentFrequency"][i]
            }
        }
        datasetRecordTime.data = chartDataJson[currHeuristic]["lineTime"];
        datasetRecordCost.data = chartDataJson[currHeuristic]["lineCost"];
        datasetTime.push(datasetRecordTime);
        datasetCost.push(datasetRecordCost);
    }

    console.log(chartDataJson)

    const configTime = {
        type: 'line',
        data: {
            labels,
            datasets: datasetTime
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Heuristic Performance Statistics for " + mazeName,
                },
            },
            legend: { display: true },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Number of Agents",
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
                        text: "Average Execution Time",
                    },
                    min: 0,
                },
            },
        },
    };
    const configCost = {
        type: 'line',
        data: {
            labels,
            datasets: datasetCost
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Heuristic Performance Statistics for " + mazeName,
                },
            },
            legend: { display: true },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Number of Agents",
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
                        text: "Average Execution Cost",
                    },
                    min: 0,
                },
            },
        },
    };
    lineChartCost = new Chart("cost-line-chart", configCost)
    lineChartTime = new Chart("time-line-chart", configTime)
}