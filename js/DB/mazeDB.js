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
        const dropdownIds = ["load_saved_maze_dropdown", "stats_maze_dropdown"];
        for (let i = 0; i < dropdownIds.length; i++) {
            const dropdownNode = document.getElementById(dropdownIds[i]);
            dropdownNode.innerHTML = "";
            if (dropdownIds[i] == "stats_maze_dropdown") {
                let optionNodeTemp = document.createElement("option");
                optionNodeTemp.innerHTML = "All mazes";
                optionNodeTemp.setAttribute("value", "All"); // value is index of maze node in mazeRecords
                dropdownNode.appendChild(optionNodeTemp);
            }
            for (let i = 0; i < this.mazeRecords.length; i++) {
                const optionNode = document.createElement("option");
                optionNode.innerHTML = this.mazeRecords[i]["maze_name"];
                optionNode.setAttribute("value", this.mazeRecords[i]["maze_id"]); // value is index of maze node in mazeRecords
                dropdownNode.appendChild(optionNode);
            }
        }
    }

    // update maze
    static async PUT() {
        // selectedIndex = this.mazeRecords[this.selectedMazeIndex] = mazeRecord;
        const mazeIndex = this.getIndex();

        // making the api body, removing the user_id and maze_name
        let updated_maze_name = JSON.parse(JSON.stringify(this.mazeRecords[mazeIndex]))["maze_name"];
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
        this.mazeRecords[mazeIndex]["maze_string"] = JSON.stringify(graphCopy);

        alert("Maze " + updated_maze_name + " updated");

    }

    // create new maze
    static async POST() {

        let new_maze_name = document.getElementById("new_maze_name").value

        const body = {
            maze_name: new_maze_name,
            maze_string: JSON.stringify(graph),
        };
        const { maze_record: mazeRecord } = await api("POST", this.endpoint, body);

        // state management
        this.mazeRecords.push(mazeRecord);

        // Front End changes
        this.updateDropdown();
        this.setIndex(mazeRecord.maze_id);
        document.getElementById("new_maze_name").value = "";

        alert("New Maze " + new_maze_name + " created");
    }

    // delete maze
    static async DELETE() {
        const deleteIndex = this.getIndex();

        // copy of record
        let deleted_maze_name = JSON.parse(JSON.stringify(this.mazeRecords[deleteIndex]))["maze_name"];
        const record = JSON.parse(JSON.stringify(this.mazeRecords[deleteIndex]));
        try {
            this.mazeRecords.splice(deleteIndex, 1);
            const body = { maze_id: record["maze_id"] };
            console.log(body);
            await api("DELETE", this.endpoint, body);
            this.updateDropdown();

            alert("Maze " + deleted_maze_name + " deleted");
        } catch (err) {
            console.log(err);
        }
    }
}