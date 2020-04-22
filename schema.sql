CREATE TABLE users (
    uid SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255),
    email_verified BOOLEAN,
    date_created timestamp,
    last_login timestamp
);

CREATE TABLE posts (
    pid SERIAL PRIMARY KEY,
    title VARCHAR(255),
    body VARCHAR,
    user_id INT REFERENCES users(uid),
    author VARCHAR REFERENCES users(username),
    like_user_id INT[] DEFAULT ARRAY[]::INT[],
    likes INT DEFAULT 0,
    date_created timestamp
);

CREATE TABLE comments (
    cid SERIAL PRIMARY KEY,
    comment VARCHAR(255),
    author VARCHAR REFERENCES users(username),
    post_id INT REFERENCES posts(pid),
    user_id INT REFERENCES users(uid),
    date_created timestamp
);

CREATE TABLE messages (
    mid SERIAL PRIMARY KEY,
    message_sender VARCHAR(255) REFERENCES users(username),
    message_to VARCHAR(255) REFERENCES users(username),
    message_title VARCHAR(255),
    message_body VARCHAR(255),
    date_created timestamp
);