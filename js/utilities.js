// update agents count dropdown
// MAPF variables "Select Number of Agents (Max. 15):" dropdown
const updateDropdown = () => {
    
    clear_flag = true;
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

// get user mapf data upon loading of app
const getUserMapfData = () => {
    // TODO: get the user token to query data 
    const {mazes:mazesAwsData,statistics:statsAwsData} = api("GET", "user_mapf_data", {});

    // update mazes dropdown
    getSavedMazes(mazesAwsData);

    // update stats dropdown 
    

}

// make api call and return value
const api = async (method, endpoint, body) => {
    const BASE_URL = "https://r0izk68gbl.execute-api.ap-southeast-1.amazonaws.com/Stage";
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // TODO: add parameter
    // myHeaders.append("Authorisation", "Bearer Token");

    const raw = JSON.stringify(body);

    let requestOptions = {
        method,
        headers: myHeaders,
        // body: raw,
        redirect: 'follow'
    };
    if(method!="GET"){
        requestOptions[body] =raw;
    }

    const res = await (await fetch(`${BASE_URL}/${endpoint}`, requestOptions)).json();

   return res;
}