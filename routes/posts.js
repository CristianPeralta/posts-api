const express = require('express');
const router = express.Router();
const pool = require("../db");

router.get('/', (req, res, next) => {
    pool.query("SELECT * FROM posts ORDER BY date_created DESC", (err, resp) => {
        if (err) return next(err);
        res.json(resp.rows);
    });
});

router.put('/likes', (req, res, next) => {
    const { uid } = req.body;
    const pid = String(req.body.postId);
    pool.query(`UPDATE posts SET like_user_id=like_user_id || ${[uid]}, likes=likes + 1
        WHERE NOT (like_user_id @> ARRAY[${uid}] AND pid=${pid})`, [], (err, resp) => {
            if (err) return next(err);
            res.json(resp.rows);
    });
});

router.get('/user', (req, res, next) => {
    const userId = Number(req.query.userId);
    pool.query(`SELECT * FROM posts 
        WHERE user_id=${userId}`, (err, resp) => {
        if (err) return next(err);
        res.json(resp.rows);
    });
});

router.post('/', (req, res, next) => {
    const { uid, title, body, username } = req.body;

    const vector = [title, body, username];

    pool.query(`INSERT INTO posts(title, body, search_vector, user_id, author, date_created)
        VALUES('${title}', '${body}', to_tsvector(${vector}), '${uid}', '${username}', NOW()::timestamp)`, [], (err, resp) => {
            if (err) return next(err);
            res.json(resp.rows);
    });
});

router.put('/', (req, res, next) => {
    const { uid, pid, title, body, username } = req.body;
    pool.query(`UPDATE posts SET title='${title}', body='${body}', user_id=${uid}, author='${username}', date_created=NOW()::timestamp
        WHERE pid=${pid}`, [], (err, resp) => {
            if (err) return next(err);
            res.json(resp.rows);
    });
});

router.delete('/', (req, res, next) => {
    const { postId } = req.body;
    pool.query(`DELETE FROM posts WHERE pid=${postId}`, [], (err, resp) => {
        if (err) return next(err);
        res.json(resp.rows);
    });
});

router.delete('/comments', (req, res, next) => {
    const { postId } = req.body;
    pool.query(`DELETE FROM comments WHERE post_id=${postId}`, [], (err, resp) => {
        if (err) return next(err);
        res.json(resp.rows);
    });
});

router.get('/comments', (req, res, next) => {
    const postId = Number(req.query.pid);
    pool.query(`SELECT * FROM comments 
        WHERE post_id=${postId} ORDER BY date_created DESC`, (err, resp) => {
            if (err) return next(err);
            res.json(resp.rows);
    });
});

router.post('/comments', (req, res, next) => {
    const { postId, comment, userId, username } = req.body;
    pool.query(`INSERT INTO comments(comment, user_id, author, post_id, date_created)
        VALUES('${comment}', '${userId}', '${username}', '${postId}', NOW()::timestamp)`, [], (err, resp) => {
            if (err) return next(err);
            res.json(resp.rows);
    });
});

router.put('/comments', (req, res, next) => {
    const { cid, postId, comment, userId, username } = req.body;
    pool.query(`UPDATE comments SET
        comment='${comment}', user_id=${userId}, post_id=${postId}, author='${username}', date_created=NOW()::timestamp
        WHERE cid=${cid}`, [], (err, resp) => {
            if (err) return next(err);
            res.json(resp.rows);
    });
});

router.delete('/comment', (req, res, next) => {
    const { cid } = req.body
    pool.query(`DELETE FROM comments
        WHERE cid=${cid}`, [], (err, resp) => {
            if (err) return next(err);
            res.json(resp.rows);
    });
});

router.delete('/', (req, res, next) => {
    const { cId } = req.body;
    pool.query(`DELETE FROM comments WHERE cid=${cId}`, [], (err, resp) => {
        if (err) return next(err);
        res.json(resp.rows);
    });
});

module.exports = router;
