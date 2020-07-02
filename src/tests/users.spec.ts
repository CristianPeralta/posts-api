import request from "supertest";
import app from '../app';

describe('Get a user', () => {
    it('succeeds with correct credentials', async () => {
        const query = { username: 'tes1111' };
        const httpRequest = get(`/users`, query);
        httpRequest.set('Accept', 'application/json')
        httpRequest.set('Origin', 'http://localhost:3000')
        const response = await httpRequest;
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

export function get(url: string, query: object){
    const httpRequest = request(app).get(url);
    httpRequest.query(query);
    httpRequest.set('Accept', 'application/json')
    httpRequest.set('Origin', 'http://localhost:3000')
    return httpRequest;
}