import { post, get, put, deleteR } from './utils';

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

const firstMessage = {
    messageSender: secondUser.username,
    messageTo: secondUser.username,
    messageTitle: 'first test message',
    messageBody: 'first test body message',
};

let pid : number = 0;
let mid: number = 0;
let uid: number = 0;
let username: string = '';

describe('Create users', () => {
    it('succeeds with the required data for first user', async () => {
        const response = await post(`/users`, firstUser);
        expect(response.status).toEqual(200);
        expect(typeof response.body).toBe('object');
        expect(response.body).toHaveProperty('uid');
        uid = response.body.uid;
        username = response.body.username;
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
        const response = await post(`/users/messages`, firstMessage);
        expect(response.status).toEqual(200);
        expect(typeof response.body).toBe('object');
        expect(response.body).toHaveProperty('mid');
        mid = response.body.mid;
        expect(response.body).toHaveProperty('message_sender', firstMessage.messageSender);
        expect(response.body).toHaveProperty('message_to',  firstMessage.messageTo);
        expect(response.body).toHaveProperty('message_title',  firstMessage.messageTitle);
        expect(response.body).toHaveProperty('message_body', firstMessage.messageBody);
        expect(response.body).toHaveProperty('date_created');
    });
});

describe('Get user messages', () => {
    it('succeeds with the required username', async () => {
        const query = {
            username: firstMessage.messageSender,
        };
        const response = await get(`/users/messages`, query);
        expect(response.status).toEqual(200);
        expect(Array.isArray(response.body)).toEqual(true);
        expect(response.body[0]).toHaveProperty('message_sender', query.username);
    });
});

describe('Delete a message', () => {
    it('succeeds with the required mid', async () => {
        const body = {
            mid: mid,
        };
        const response = await deleteR(`/users/messages`, body);
        expect(response.status).toEqual(200);
        expect(typeof response.body).toBe('object');
        expect(response.body).toHaveProperty('mid', body.mid);
    });
});

describe('Create a post', () => {
    it('succeeds with correct post data', async () => {
        const firstPost = {
            uid: uid,
            title: 'First post title',
            body: 'First post body',
            username: username,
        };
        const response = await post(`/posts`, firstPost);
        expect(response.status).toEqual(200);
        expect(typeof response.body).toBe('object');
        expect(response.body).toHaveProperty('pid');
        pid = response.body.pid;
    });
});

describe('Get posts', () => {
    it('Get all posts', async () => {
        const response = await get(`/posts`);
        expect(response.status).toEqual(200,);
        expect(typeof response.body).toBe('object');
        expect(Array.isArray(response.body)).toEqual(true);
        if (response.body.length) {
            expect(response.body[0]).toHaveProperty('pid');
            expect(response.body[0]).toHaveProperty('title');
            expect(response.body[0]).toHaveProperty('body');
            expect(response.body[0]).toHaveProperty('user_id');
            expect(response.body[0]).toHaveProperty('author');
            expect(response.body[0]).toHaveProperty('like_user_id');
            expect(response.body[0]).toHaveProperty('likes');
            expect(response.body[0]).toHaveProperty('date_created');
            expect(response.body[0]).toHaveProperty('search_vector');
        }
    });

    it('Get posts by keyword', async () => {
        const query = {
            query: 'first',
        };
        const response = await get(`/posts`, query);
        expect(response.status).toEqual(200);
        expect(typeof response.body).toBe('object');
        expect(Array.isArray(response.body)).toEqual(true);
        if (response.body.length) {
            expect(response.body[0]).toHaveProperty('pid');
            expect(response.body[0]).toHaveProperty('title');
            expect(response.body[0]).toHaveProperty('body');
            expect(response.body[0].body.toLowerCase()).toEqual(expect.stringContaining('first'));
            expect(response.body[0]).toHaveProperty('user_id');
            expect(response.body[0]).toHaveProperty('author');
            expect(response.body[0]).toHaveProperty('like_user_id');
            expect(response.body[0]).toHaveProperty('likes');
            expect(response.body[0]).toHaveProperty('date_created');
            expect(response.body[0]).toHaveProperty('search_vector');
        }
    });
    
    it('Get posts by username', async () => {
        const query = {
            username: username,
        };
        const response = await get(`/posts`, query);
        expect(response.status).toEqual(200);
        expect(typeof response.body).toBe('object');
        expect(Array.isArray(response.body)).toEqual(true);
        if (response.body.length) {
            expect(response.body[0]).toHaveProperty('pid');
            expect(response.body[0]).toHaveProperty('title');
            expect(response.body[0]).toHaveProperty('body');
            expect(response.body[0]).toHaveProperty('user_id');
            expect(response.body[0]).toHaveProperty('author', query.username);
            expect(response.body[0]).toHaveProperty('like_user_id');
            expect(response.body[0]).toHaveProperty('likes');
            expect(response.body[0]).toHaveProperty('date_created');
            expect(response.body[0]).toHaveProperty('search_vector');
        }
    });

    it('Get posts by userId', async () => {
        const query = {
            userId: uid,
        };
        const response = await get(`/posts`, query);
        expect(response.status).toEqual(200);
        expect(typeof response.body).toBe('object');
        expect(Array.isArray(response.body)).toEqual(true);
        if (response.body.length) {
            expect(response.body[0]).toHaveProperty('pid');
            expect(response.body[0]).toHaveProperty('title');
            expect(response.body[0]).toHaveProperty('body');
            expect(response.body[0]).toHaveProperty('user_id', query.userId);
            expect(response.body[0]).toHaveProperty('author');
            expect(response.body[0]).toHaveProperty('like_user_id');
            expect(response.body[0]).toHaveProperty('likes');
            expect(response.body[0]).toHaveProperty('date_created');
            expect(response.body[0]).toHaveProperty('search_vector');
        }
    });

    it('Search posts', async () => {
        const query = {
            query: 'first',
        };
        const response = await get(`/posts/search`, query);
        expect(response.status).toEqual(200);
        expect(typeof response.body).toBe('object');
        expect(Array.isArray(response.body)).toEqual(true);
        if (response.body.length) {
            expect(response.body[0]).toHaveProperty('pid');
            expect(response.body[0]).toHaveProperty('title');
            expect(response.body[0]).toHaveProperty('body');
            expect(response.body[0].body.toLowerCase()).toEqual(expect.stringContaining('first'));
            expect(response.body[0]).toHaveProperty('user_id');
            expect(response.body[0]).toHaveProperty('author');
            expect(response.body[0]).toHaveProperty('like_user_id');
            expect(response.body[0]).toHaveProperty('likes');
            expect(response.body[0]).toHaveProperty('date_created');
            expect(response.body[0]).toHaveProperty('search_vector');
        }
    });
});

describe('Give a like to a post', () => {
    it('succeeds with correct postId', async () => {
        const body = {
            uid: uid,
            postId: pid,
        };
        const response = await put(`/posts/likes`, body);
        expect(response.status).toEqual(200);
        expect(typeof response.body).toBe('object');
        expect(response.body).toHaveProperty('pid', body.postId);
        expect(response.body.like_user_id).toEqual(expect.arrayContaining([uid]));
    });
});
