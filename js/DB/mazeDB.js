class MazeDB {
    static mazeRecords = [];
    static endpoint = "maze";
    static selectedMazeIndex = 0;

    static getIndex() {
        const mazeId = document.getElementById("load_saved_maze_dropdown").value;
        for (let i = 0; i < this.mazeRecords.length; i++) {
            const currRecord = this.mazeRecords[i];
            if (currRecord.maze_id == mazeId) {
                return i;
            }
        }
        return -1;
    }

    // changes the drop down based on id
    static setIndex(maze_id) {
        document.getElementById("load_saved_maze_dropdown").value = maze_id;
    }

    static getMazeRecord() {
        const mazeIndex = this.getIndex();
        return this.mazeRecords[mazeIndex];
    }

    // GET not required cos of onload()
    static setMazeDB(mazes) {
        this.mazeRecords = mazes;
        // console.log(this.mazeRecords);
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
    static async PUT() {
        // selectedIndex = this.mazeRecords[this.selectedMazeIndex] = mazeRecord;
        const mazeIndex = this.getIndex();

        // making the api body, removing the user_id and maze_name
        let mazeRecord = JSON.parse(JSON.stringify(this.mazeRecords[mazeIndex]));
        delete mazeRecord.user_id;
        delete mazeRecord.maze_name;
        let graphCopy = JSON.parse(JSON.stringify(graph));
        for (let i = 0; i < graphCopy.length; i++) {
            for (let j = 0; j < graphCopy[0].length; j++) {
                if (graphCopy[i][j] == AGENT) {
                    graphCopy[i][j] = EMPTY;
                }
            }
        }
        console.log(graphCopy);
        mazeRecord["maze_string"] = JSON.stringify(graphCopy);

        await api("PUT", this.endpoint, mazeRecord);
    }

    // create new maze
    static async POST() {
        const body = {
            maze_name: document.getElementById("new_maze_name").value,
            maze_string: JSON.stringify(graph),
        };
        const { maze_record: mazeRecord } = await api("POST", this.endpoint, body);

        // state management
        this.mazeRecords.push(mazeRecord);

        // FE changes
        this.updateDropdown();
        this.setIndex(mazeRecord.maze_id);
        document.getElementById("new_maze_name").value = "";
    }

    // delete maze
    static async DELETE() {
        const deleteIndex = this.getIndex();
        // copy of record
        const record = JSON.parse(JSON.stringify(this.mazeRecords[deleteIndex]));
        try {
            this.mazeRecords.splice(deleteIndex, 1);
            const body = { maze_id: record["maze_id"] };
            console.log(body);
            await api("DELETE", this.endpoint, body);
            this.updateDropdown();
        } catch (err) {
            console.log(err);
        }
    }
}