// update agents count dropdown
// MAPF variables "Select Number of Agents (Max. 15):" dropdown
const updateDropdown = () => {
    
    clear_flag = true;
    let numAgents = document.getElementById("numAgents").value;
    
    if(numAgents>15){
        document.getElementById("numAgents").value=15;
        numAgents=15;
    }
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
const getUserMapfData = async () => {
    // TODO: get the user token to query data
    const { mazes: mazesAwsData, statistics: statsAwsData } = await api(
      "GET",
      "user_mapf_data",
      {}
    );
    // console.log(mazesAwsData, statsAwsData);
    // update mazes dropdown
    //   getSavedMazes(mazesAwsData);
  
    // update stats dropdown
  };
  
  // make api call and return value
  const api = async (method, endpoint, body) => {
    const BASE_URL =
      "https://r0izk68gbl.execute-api.ap-southeast-1.amazonaws.com/Stage";
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify(body);
  
    let requestOptions = {
      method,
      redirect: "follow",
    };
    if (method != "GET") {
        console.log(raw)
      requestOptions["body"] = raw;
      requestOptions["headers"] = myHeaders;
    }
  
    const res = await (
      await fetch(`${BASE_URL}/${endpoint}`, requestOptions)
    ).json();
  
    return res;
  };
  
  // api("GET", "/maze").then(console.log);
  //
  // var requestOptions = {
  //   method: "GET",
  //   redirect: "follow",
  // };
  
  // fetch(
  //   "https://r0izk68gbl.execute-api.ap-southeast-1.amazonaws.com/Stage/maze",
  //   requestOptions
  // )
  //   .then((response) => response.text())
  //   .then((result) => console.log(result))
  //   .catch((error) => console.log("error", error));