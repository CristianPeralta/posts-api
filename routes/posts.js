const express = require('express');
const router = express.Router();
const pool = require("../db");

router.get('/', (req, res, next) => {
    pool.query("SELECT * FROM posts ORDER BY date_created DESC", (err, resp) => {
        if (err) return next(err);
        res.json(resp.rows);
    });
});

router.get('/user', (req, res, next) => {
    const userId = String(req.query.userId);
    pool.query(`SELECT * FROM posts 
        WHERE user_id=${userId}`, (err, resp) => {
        if (err) return next(err);
        res.json(resp.rows);
    });
});

router.post('/', (req, res, next) => {
    const { uid, title, body, username } = req.body;
    pool.query(`INSERT INTO posts(title, body, user_id, author, date_created)
        VALUES('${title}', '${body}', '${uid}', '${username}', NOW())`, [], (err, resp) => {
            if (err) return next(err);
            res.json(resp.rows);
    });
});

router.put('/', (req, res, next) => {
    const { uid, pid, title, body, username } = req.body;
    pool.query(`UPDATE posts SET title=${title}, body=${body}, user_id=${uid}, author=${username}, date_created=NOW())
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

router.get('/comments', (req, res) => {
    const postId = String(req.query.postId);
    pool.query(`SELECT * FROM comments 
        WHERE post_id=${postId} ORDER BY data_created DESC`, (err, resp) => {
        res.json(resp.rows);
    });
});

router.post('/comments', (req, res, next) => {
    const { postId, comment, userId, username } = req.body;
    pool.query(`INSERT INTO comments(comment, user_id, author, post_id, date_created)
        VALUES(${comment}, ${userId}, ${username}, ${postId}, NOW())`, [], (err, resp) => {
            if (err) return next(err);
            res.json(resp.rows);
    });
});

router.put('/comments', (req, res, next) => {
    const { cid, postId, comment, userId, username } = req.body;
    pool.query(`UPDATE comments SET
        comment=${comment}, user_id=${userId}, post_id=${postId} author=${username}, date_created=NOW())
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
