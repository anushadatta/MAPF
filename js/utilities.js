const updateDropdown = ()=>{
    // TODO: when this happens reset the maze
    const numAgents = document.getElementById("numAgents").value;
    console.log(numAgents);

    const dropdownNode = document.getElementById("agent_dropdown");
    dropdownNode.innerHTML="";
    agentPositions=[];
    for(let i=1; i<=numAgents; i++){
        agentPositions.push([false,false]);
        const optionNode = document.createElement("option");
        optionNode.innerHTML=`Agent ${i}`;
        optionNode.setAttribute("value",i);
        dropdownNode.appendChild(optionNode);
    }
}

// make api call and return value
const api = async(endpoint,body)=>{
    
}