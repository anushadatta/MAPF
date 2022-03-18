// will run onload
const onload = async () => {
    authOnLoad();

    const { mazes: mazesAwsData, statistics: statsAwsData } = await api(
        "GET",
        "user_mapf_data",
        {}
    );
    MazeDB.setMazeDB(mazesAwsData);
    updateNumAgentsDropdown();

    statsData = statsAwsData;
    // console.log(statsData)
    // updateStats();
};

// Authentication: Global variables
let authObject = {
    id_token: "",
    //   access_token: "",
    //   refresh_token: "",
};

// run this function when page is loaded
const authOnLoad = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("id_token")) {
        //   logged in
        authObject["id_token"] = params.get("id_token");
        // authObject["access_token"] = params.get("access_token");
        // authObject["refresh_token"] = params.get("refresh_token");
    } else {
        //   not logged in
        console.log("not logged in");
    }
};

// update agents count dropdown
// MAPF variables "Select Number of Agents (Max. 15):" dropdown
const updateNumAgentsDropdown = () => {
    // clear maze every time number of agents updated by user
    clear_flag = true;

    // only allow integer inputs in dropdown
    let numAgents = parseInt(document.getElementById("numAgents").value);
    document.getElementById("numAgents").value = numAgents;

    // limit number of agents to 15
    if (numAgents > 15) {
        document.getElementById("numAgents").value = 15;
        numAgents = 15;
    }

    // populate agent dropdown based on count entered by user
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
};

// buttons select/unselect
const button_selection_css = (selected_button_id, unselected_button_id) => {
    // unselect other buttons
    unselected_button = document.getElementById(unselected_button_id[0]);
    unselected_button.classList.remove("button-clicked");

    unselected_button = document.getElementById(unselected_button_id[1]);
    unselected_button.classList.remove("button-clicked");

    // set button as selected
    selected_button = document.getElementById(selected_button_id);
    selected_button.classList.add("button-clicked");
};

// make api call and return value
const api = async (method, endpoint, body) => {
    const BASE_URL =
        "https://r0izk68gbl.execute-api.ap-southeast-1.amazonaws.com/Stage";
    const myHeaders = new Headers();

    console.log(authObject["id_token"]);
    myHeaders.append("Authorization", authObject["id_token"]);
    const raw = JSON.stringify(body);

    let requestOptions = {
        method,
        redirect: "follow",
    };

    if (method != "GET") {
        requestOptions["body"] = raw;
        myHeaders.append("Content-Type", "application/json");
    }

    requestOptions["headers"] = myHeaders;
    // requestOptions["mode"] = 'no-cors';

    // console.log(`${BASE_URL}/${endpoint}`, requestOptions)
    const res = await (
        await fetch(`${BASE_URL}/${endpoint}`, requestOptions)
    ).json();

    return res;
};

const setStyleDisplayDeleteMazeModal = (displayType) => {
    document.getElementById("delete-maze-modal").style.display = displayType;
};