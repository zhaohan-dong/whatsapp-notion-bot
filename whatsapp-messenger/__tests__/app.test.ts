import request from 'supertest';
import express, {Express, Request, Response} from "express";
let app: Express;

describe('Express app', () => {

    beforeEach(() => {
        // Set environment variables for testing
        process.env = {};
        process.env.JWT_USERNAME = 'testUser';
        process.env.JWT_PASSWORD = 'testPass';
        process.env.JWT_SECRET_KEY = 'testSecret';

        // Re-import app after resetting modules
        app = require('../src/app').default;

    });

    it('should respond to health check', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Healthy');
    });

    it('should not authenticate with wrong credentials on /login', async () => {
        const response = await request(app).post('/login')
            .send({ username: 'wrongUser', password: 'wrongPass' });

        expect(response.status).toBe(401);  // Assuming 401 for unauthorized
    });

    // jwtToken for further test authentication
    let jwtToken: string;
    it('should authenticate with correct credentials on /login', async () => {
        // Assuming a username/password login. Adjust as necessary.
        const response = await request(app).post('/login')
            .send({ username: 'testUser', password: 'testPass' });

        expect(response.status).toBe(200);
        expect(response.body.jwtToken).toBeDefined();
        jwtToken = response.body.jwtToken;
    });

    it('should require authentication for sendMessage', async () => {
        const response = await request(app).post('/sendMessage');
        expect(response.status).toBe(401);  // Assuming 401 for unauthorized
    });

    it('should require authentication for getChatIdByName', async () => {
        const response = await request(app).get('/getChatIdByName');
        expect(response.status).toBe(401);  // Assuming 401 for unauthorized
    });

    // ... Further tests for other routes and scenarios ...

});

