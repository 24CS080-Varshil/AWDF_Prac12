
const request = require("supertest");
const app = require("../app");

describe("Task Manager API", () => {
    test("GET /tasks rejects requests without authentication", async () => {
        const response = await request(app).get("/tasks");

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe(
            "Authentication token is required"
        );
    });
    test("GET / returns 404 for an unknown route", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Route not found");
    });
});
