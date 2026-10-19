const taskEvents = require("./events");

taskEvents.on("error", (error, context = "task event") => {
    console.error(`[Task Events] ${context} failed: ${error.message}`);
});

taskEvents.on("task-created", (task) => {
    const queuedAt = new Date().toISOString();
    const title = task?.title || "untitled task";
    console.log(`[Notification] Queued task-created for "${title}" at ${queuedAt}`);

    setTimeout(() => {
        try {
            if (!task?.title || !task?.owner) {
                throw new Error("A created task must include a title and owner");
            }

            console.log(
                `[Notification] Task "${task.title}" created at ${new Date().toISOString()} for assigned user ${task.owner}`
            );
        } catch (error) {
            taskEvents.emit("error", error, "task-created notification");
        }
    }, 2000);
});

taskEvents.on("task-deleted", (task) => {
    console.log(`[Notification] Task "${task.title}" deleted at ${new Date().toISOString()}`);
});
