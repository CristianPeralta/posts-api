import request from "supertest";
import app from '../app';

const firstUser = {
    username: 'usertest123',
    email: 'usertest123@test.org',
    emailVerified: false,
};

const secondUser = {
    username: 'usertest1234',
    email: 'usertest1234@test.org',
    emailVerified: false,
};

describe('Create users', () => {
    it('succeeds with the required data for first user', async () => {
        const response = await post(`/users`, firstUser);
        expect(response.status).toEqual(200);
        expect(typeof response.body).toBe('object');
        expect(response.body).toHaveProperty('uid');
        expect(response.body).toHaveProperty('username', firstUser.username);
        expect(response.body).toHaveProperty('email', firstUser.email);
        expect(response.body).toHaveProperty('email_verified', false);
        expect(response.body).toHaveProperty('date_created');
        expect(response.body).toHaveProperty('last_login');
    });

    it('succeeds with the required data for second user', async () => {
        const response = await post(`/users`, secondUser);
        expect(response.status).toEqual(200);
        expect(typeof response.body).toBe('object');
        expect(response.body).toHaveProperty('uid');
        expect(response.body).toHaveProperty('username', secondUser.username);
        expect(response.body).toHaveProperty('email', secondUser.email);
        expect(response.body).toHaveProperty('email_verified', false);
        expect(response.body).toHaveProperty('date_created');
        expect(response.body).toHaveProperty('last_login');
    });
});

describe('Get a user', () => {
    it('succeeds with correct query', async () => {
        const query = { username: 'usertest123' };
        const response = await get(`/users`, query);
        expect(response.status).toEqual(200);
        expect(typeof response.body).toBe('object');
        expect(response.body).toHaveProperty('uid');
        expect(response.body).toHaveProperty('username', firstUser.username);
        expect(response.body).toHaveProperty('email', firstUser.email);
        expect(response.body).toHaveProperty('email_verified', false);
        expect(response.body).toHaveProperty('date_created');
        expect(response.body).toHaveProperty('last_login');
    });
});

describe('Create messages', () => {
    it('succeeds with the required data for send messages from user 1 to user 2', async () => {
        const firstMessage = {
            messageSender: secondUser.username,
            messageTo: secondUser.username,
            messageTitle: 'first test message',
            messageBody: 'first test body message',
        };
        const response = await post(`/users/messages`, firstMessage);
        expect(response.status).toEqual(200);
        expect(typeof response.body).toBe('object');
    });
});

export function post(url: string, body: object){
    const httpRequest = request(app).post(url);
    httpRequest.send(body);
    httpRequest.set('Accept', 'application/json')
    httpRequest.set('Origin', 'http://localhost:3000')
    return httpRequest;
}

export function get(url: string, query?: object){
    const httpRequest = request(app).get(url);
    if (query) {
        httpRequest.query(query);
    }
    httpRequest.set('Accept', 'application/json')
    httpRequest.set('Origin', 'http://localhost:3000')
    return httpRequest;
}