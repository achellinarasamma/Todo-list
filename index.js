const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Allow all origins

// API routes
app.get("/", (req, res) => res.send("Server at work"));

// Get all tasks
app.get("/alltasks", (req, res) => {
    const tasks = JSON.parse(fs.readFileSync("./Todo.json", "utf-8"));
    res.status(200).send(tasks);
});

// Add task
app.post("/add", (req, res) => {
    const { id, task } = req.body;
    if (!id || !task) {
        return res.status(400).send({ error: "Send all fields" });
    }
    const allTasks = JSON.parse(fs.readFileSync("./Todo.json", "utf-8"));
    const isduplicateId = allTasks.find((ele) => ele.id == id);
    if (isduplicateId) {
        return res.status(400).send({ error: "id already existed" });
    } else {
        allTasks.push({ id, task });
        fs.writeFileSync("./Todo.json", JSON.stringify(allTasks));
        res.status(201).send({ message: "Task stored in server" });
    }
});

// Delete task
app.delete("/delete", (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).send({ error: "Send id to delete task" });
        } else {
            const allTasks = JSON.parse(fs.readFileSync("./Todo.json", "utf-8"));
            const isId = allTasks.find((ele) => ele.id == id);
            if (!isId) {
                return res.status(400).send({ error: "id is not present" });
            } else {
                const updatedTasks = allTasks.filter((ele) => ele.id != id);
                fs.writeFileSync("./Todo.json", JSON.stringify(updatedTasks));
                res.status(200).send({ message: "Task deleted from server" });
            }
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// Edit task
app.put("/edit", (req, res) => {
    try {
        const { id, newTask } = req.body;
        if (!id || !newTask) {
            return res.status(400).send({ error: "Send all required fields" });
        } else {
            const allTasks = JSON.parse(fs.readFileSync("./Todo.json", "utf-8"));
            const isId = allTasks.find((ele) => ele.id == id);
            if (!isId) {
                return res.status(400).send({ error: "Invalid Id" });
            } else {
                const updatedTasks = allTasks.map((ele) => {
                    if (ele.id == id) {
                        ele.task = newTask;
                    }
                    return ele;
                });
                fs.writeFileSync("./Todo.json", JSON.stringify(updatedTasks));
                res.status(200).send({ message: "Task updated successfully" });
            }
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

const port = 7000;
const hostname = "127.0.0.1"; // or "0.0.0.0"
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
});
