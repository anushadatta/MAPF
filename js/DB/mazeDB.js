class MazeDB {

    static mazeRecords = [];
    static endpoint = "maze";
    static selectedMazeIndex = 0;

    static getIndex() {
        const mazeId = document.getElementById("load_saved_maze_dropdown").value;
        console.log(mazeId)
        for (let i = 0; i < this.mazeRecords.length; i++) {
            const currRecord = this.mazeRecords[i];
            if (currRecord.maze_id == mazeId) {
                console.log(i);
                return i

            }
        }
        return -1;
    }

    // GET not required cos of onload() 
    static setMazeDB(mazes) {
        this.mazeRecords = mazes;
        this.updateDropdown();
    }
    static updateDropdown() {
        // update dropdown
        const dropdownNode = document.getElementById("load_saved_maze_dropdown");
        dropdownNode.innerHTML = "";
        for (let i = 0; i < this.mazeRecords.length; i++) {
            const optionNode = document.createElement("option");
            optionNode.innerHTML = this.mazeRecords[i]["maze_name"];
            optionNode.setAttribute("value", this.mazeRecords[i]["maze_id"]); // value is index of maze node in mazeRecords
            dropdownNode.appendChild(optionNode);
        }
    }

    // update maze
    static async PUT(mazeRecord) {
        selectedIndex =
            this.mazeRecords[this.selectedMazeIndex] = mazeRecord;
        api("PUT", this.endpoint, mazeRecord);
    }

    // create new maze
    static async POST(mazeRecord) {
        this.mazeRecords.push(mazeRecord);
        api("POST", this.endpoint)

        // TODO: return new maze record with ID from backend, and append to dictionary
    }

    // delete maze
    static async DELETE() {
        const deleteIndex = this.getIndex();
        const record = JSON.parse(JSON.stringify(this.mazeRecords[deleteIndex]));
        try {
            this.mazeRecords.splice(deleteIndex, 1);
            const body = { "maze_id": record["maze_id"] };
            console.log(body)
            await api("DELETE", this.endpoint, body);
            this.updateDropdown();
        } catch (err) {
            console.log(err);
        }

    }
}