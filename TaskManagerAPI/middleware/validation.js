const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isPlainObject = (value) =>
    Boolean(value) && typeof value === "object" && !Array.isArray(value);

function validateCredentials(req, res, next) {
    const { email, password } = req.body || {};

    if (!isPlainObject(req.body)) {
        return res.status(400).json({ message: "Request body must be a JSON object" });
    }

    if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
        return res.status(400).json({ message: "A valid email address is required" });
    }

    if (typeof password !== "string" || password.length < 8) {
        return res.status(400).json({ message: "Password must contain at least 8 characters" });
    }

    req.credentials = {
        email: email.trim().toLowerCase(),
        password
    };
    next();
}

function validateTask(isUpdate = false) {
    return (req, res, next) => {
        if (!isPlainObject(req.body)) {
            return res.status(400).json({ message: "Request body must be a JSON object" });
        }

        const data = {};
        const { title, description, completed } = req.body;

        if (!isUpdate || title !== undefined) {
            if (typeof title !== "string" || !title.trim()) {
                return res.status(400).json({ message: "Task title is required" });
            }
            data.title = title.trim();
        }

        if (description !== undefined) {
            if (typeof description !== "string") {
                return res.status(400).json({ message: "Task description must be text" });
            }
            data.description = description.trim();
        }

        if (completed !== undefined) {
            if (typeof completed !== "boolean") {
                return res.status(400).json({ message: "Completed must be true or false" });
            }
            data.completed = completed;
        }

        if (isUpdate && Object.keys(data).length === 0) {
            return res.status(400).json({ message: "Provide at least one task field" });
        }

        req.taskData = data;
        next();
    };
}

module.exports = {
    validateCredentials,
    validateNewTask: validateTask(),
    validateTaskUpdate: validateTask(true)
};
