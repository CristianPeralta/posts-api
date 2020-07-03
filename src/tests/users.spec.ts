import request from "supertest";
import app from '../app';

describe('Create a user', () => {
    it('succeeds with the required data', async () => {
        const user = {
            username: 'usertest123',
            email: 'usertest123@test.org',
            emailVerified: false,
        };
        const response = await post(`/users`, user);
        expect(response.status).toEqual(200);
        expect(typeof response.body).toBe('object');
    });
});

describe('Get a user', () => {
    it('succeeds with correct query', async () => {
        const query = { username: 'tes1111' };
        const response = await get(`/users`, query);
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