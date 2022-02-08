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
const api = async (method, endpoint, body) => {
    const BASE_URL = "https://r0izk68gbl.execute-api.ap-southeast-1.amazonaws.com/Stage";
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(body);

    const requestOptions = {
        method,
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const res = await (await fetch(`${BASE_URL}/${endpoint}`, requestOptions)).json();

   return res;
}