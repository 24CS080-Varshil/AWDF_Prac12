const express = require("express");
const Task = require("../models/Task");
const authenticate = require("../middleware/auth");
const { validateNewTask, validateTaskUpdate } = require("../middleware/validation");

const router = express.Router();

const toTaskResponse = (task) => ({
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    completed: task.completed,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
});

router.use(authenticate);

router.get("/", async (req, res) => {

    const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tasks.map(toTaskResponse));

});

router.post("/", validateNewTask, async (req, res) => {

    const newTask = await Task.create({
        title: req.taskData.title,
        description: req.taskData.description || "",
        completed: req.taskData.completed || false,
        owner: req.user.id
    });

    res.status(201).json({
        message: "Task created successfully",
        task: toTaskResponse(newTask)
    });

});

router.put("/:id", validateTaskUpdate, async (req, res) => {

    const task = await Task.findOneAndUpdate({ _id: req.params.id, owner: req.user.id }, req.taskData, {
        new: true,
        runValidators: true
    });

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.status(200).json({
        message: "Task updated successfully",
        task: toTaskResponse(task)
    });

});

router.delete("/:id", async (req, res) => {

    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.status(200).json({
        message: "Task deleted successfully"
    });

});

module.exports = router;
