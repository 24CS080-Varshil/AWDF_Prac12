function errorHandler(err, req, res, next) {

    console.error(err);

    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            message: "Request body must be valid JSON"
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Task id is not valid"
        });
    }

    if (err.code === 11000) {
        return res.status(409).json({
            message: "A record with this value already exists"
        });
    }

    res.status(500).json({
        message: "Internal Server Error"
    });

}

module.exports = errorHandler;
