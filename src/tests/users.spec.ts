import request from "supertest";
import app from '../app';

const user = {
    username: 'usertest123',
    email: 'usertest123@test.org',
    emailVerified: false,
};

describe('Create a user', () => {
    it('succeeds with the required data', async () => {
        const response = await post(`/users`, user);
        expect(response.status).toEqual(200);
        expect(typeof response.body).toBe('object');
        expect(response.body).toHaveProperty('uid');
        expect(response.body).toHaveProperty('username', user.username);
        expect(response.body).toHaveProperty('email', user.email);
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
        expect(response.body).toHaveProperty('username', user.username);
        expect(response.body).toHaveProperty('email', user.email);
        expect(response.body).toHaveProperty('email_verified', false);
        expect(response.body).toHaveProperty('date_created');
        expect(response.body).toHaveProperty('last_login');
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