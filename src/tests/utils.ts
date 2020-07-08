import request from "supertest";
import app from '../app';

export function post(url: string, body: object){
    const httpRequest = request(app).post(url);
    httpRequest.send(body);
    httpRequest.set('Accept', 'application/json')
    httpRequest.set('Origin', 'http://localhost:3000')
    return httpRequest;
}

export function put(url: string, body: object){
    const httpRequest = request(app).put(url);
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

export function deleteR(url: string, body?: object){
    const httpRequest = request(app).delete(url);
    httpRequest.send(body);
    httpRequest.set('Accept', 'application/json')
    httpRequest.set('Origin', 'http://localhost:3000')
    return httpRequest;
}
