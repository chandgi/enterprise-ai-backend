import { generateFromMsgs } from './chatController.js';
import express from 'express';
import request from 'supertest';

jest.mock('./chatController.js', () => ({
    generateFromMsgs: jest.fn((req, res) => res.status(200).json({ response: 'Mock response' }))
}));

const app = express();
app.use(express.json());
app.post('/api/chat/:model/generate', generateFromMsgs);

describe('Chat Controller', () => {
    it('should call generateFromMsgs method', async () => {
        const model = 'llama3.2:1b';
        const messages = [{ role: 'user', content: 'Hello' }];
        const response = await request(app)
            .post(`/api/chat/${model}/generate`)
            .send({ messages });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('response');
        expect(generateFromMsgs).toHaveBeenCalled();
    });
});