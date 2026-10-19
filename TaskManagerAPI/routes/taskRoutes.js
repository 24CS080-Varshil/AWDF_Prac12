const express = require("express");
const Task = require("../models/Task");
const authenticate = require("../middleware/auth");
const { validateNewTask, validateTaskUpdate } = require("../middleware/validation");
const cache = require("../cache");
const taskEvents = require("../events");

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
    const key = cache.tasksKey(req.user.id);
    const cachedTasks = cache.get(key);

    if (cachedTasks !== undefined) {
        return res.status(200).json(cachedTasks);
    }

    const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
    const response = tasks.map(toTaskResponse);
    cache.set(key, response);

    res.status(200).json(response);

});

router.get("/debug/cache", (req, res) => {
    res.status(200).json(cache.getStats());
});

router.get("/:id", async (req, res) => {
    const key = cache.taskKey(req.user.id, req.params.id);
    const cachedTask = cache.get(key);

    if (cachedTask !== undefined) {
        return res.status(200).json({ task: cachedTask });
    }

    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    const response = toTaskResponse(task);
    cache.set(key, response);
    res.status(200).json({ task: response });
});

router.post("/", validateNewTask, async (req, res) => {

    const newTask = await Task.create({
        title: req.taskData.title,
        description: req.taskData.description || "",
        completed: req.taskData.completed || false,
        owner: req.user.id
    });
    cache.invalidateTaskList(req.user.id);

    const taskResponse = toTaskResponse(newTask);
    taskEvents.emit("task-created", newTask);

    res.status(201).json({
        message: "Task created successfully",
        task: taskResponse
    });
    console.log(`[API] Task creation response sent at ${new Date().toISOString()}`);

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

    cache.invalidateTask(req.user.id, req.params.id);

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

    cache.invalidateTask(req.user.id, req.params.id);

    res.status(200).json({
        message: "Task deleted successfully"
    });
    taskEvents.emit("task-deleted", task);

});

module.exports = router;
