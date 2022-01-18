const updateDropdown = ()=>{
    const numAgents = document.getElementById("numAgents").value;
    console.log(numAgents);

    const dropdownNode = document.getElementById("agent_dropdown");
    dropdownNode.innerHTML="";
    for(let i=1; i<=numAgents; i++){
        const optionNode = document.createElement("option");
        optionNode.innerHTML=`Agent ${i}`;
        optionNode.setAttribute("value",i);
        dropdownNode.appendChild(optionNode);
    }
}