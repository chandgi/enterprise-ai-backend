import request from "supertest";
import app from "../app.js"; // Ensure this is the correct import path for your Express app

describe("Chat Routes", () => {
      it("should return a list of chat models", async () => {
        const response = await request(app).get("api/chat/list");

        console.log("API Response:", response.body); // Debugging

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("models");
        expect(Array.isArray(response.body.models)).toBe(true);
    });

    // it("should generate a chat response", async () => {
    //     const response = await request(app)
    //         .post("/chat/mistral/generate") // Ensure model name is included
    //         .send({ message: "Hello" });

    //     expect(response.status).toBe(200);
    //     expect(response.body).toHaveProperty("response"); // Check if AI response is received
    // });

    // it("should return 400 if message is missing", async () => {
    //     const response = await request(app)
    //         .post("/chat/mistral/generate")
    //         .send({}); // Missing message

    //     expect(response.status).toBe(400);
    //     expect(response.body).toHaveProperty("error");
    // });

    // it("should return 500 if there is a server error", async () => {
    //     jest.spyOn(console, "error").mockImplementation(() => {}); // Prevent console spam

    //     jest.spyOn(app, "post").mockImplementation(() => {
    //         throw new Error("Server error");
    //     });

    //     const response = await request(app)
    //         .post("/chat/mistral/generate")
    //         .send({ message: "Test" });

    //     expect(response.status).toBe(500);
    //     expect(response.body).toHaveProperty("error");
    // });
});
