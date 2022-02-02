const updateDropdown = () => {
    // TODO: when this happens reset the maze
    const numAgents = document.getElementById("numAgents").value;

    const dropdownNode = document.getElementById("agent_dropdown");
    dropdownNode.innerHTML = "";
    agentPositions = [];
    for (let i = 1; i <= numAgents; i++) {
        agentPositions.push([false, false]);
        const optionNode = document.createElement("option");
        optionNode.innerHTML = `Agent ${i}`;
        optionNode.setAttribute("value", i);
        dropdownNode.appendChild(optionNode);
    }
}

// make api call and return value
const api = async (endpoint, body) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ "agentPositions": [[[0, 1], [3, 2]], [[1, 0], [2, 3]], [[0, 2], [1, 2]], [[1, 1], [0, 2]]], "formattedMaze": [[1, 0, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0], [1, 0, 0, 1]] });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };


    const res = await (await fetch("https://hnqvinlkof.execute-api.ap-southeast-1.amazonaws.com/Prod/solve", requestOptions)).json();

    console.log(res);
}