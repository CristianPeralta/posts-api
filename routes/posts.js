const express = require('express');
const router = express.Router();
const pool = require("../db");

router.get('/', (req, res, next) => {
    let where = 'WHERE';
    if (req.query.query) {
        const tsQuery = `to_tsquery('${String(req.query.query)}')`;
        where = `${where} search_vector @@ ${tsQuery}`;
    }
    if (req.query.username) {
        const username = String(req.query.username);
        where = `${where} author='${username}'`;
    }
    if (req.query.userId) {
        const userId = Number(req.query.userId);
        where = `${where} user_id='${userId}'`;
    }
    const select = `SELECT * FROM posts `;
    const orderBy = `ORDER BY date_created DESC`;
    const query = `${select} ${where !== 'WHERE' ? where : ''} ${orderBy}`;
    pool.query(query, (err, resp) => {
        if (err) return next(err);
        return res.status(200).json(resp.rows);
    });
});

router.put('/likes', (req, res, next) => {
    const { uid } = req.body;
    const pid = String(req.body.postId);
    console.log('req.body', req.body);
    pool.query(`UPDATE posts SET like_user_id=like_user_id || ${[uid]}, likes=likes + 1
        WHERE NOT (like_user_id @> ARRAY[${uid}] AND pid=${pid}) RETURNING *`, [], (err, resp) => {
            if (err) return next(err);
            pool.query(`SELECT * FROM posts WHERE pid=${pid}`, [], (err, response) => {
                if (err) return next(err);
                console.log('req.row', resp.rows);
                return res.json(response.rows[0]);
            });
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

router.get('/username', (req, res, next) => {
    const username = String(req.query.username);
    pool.query(`SELECT * FROM posts 
        WHERE author='${username}'`, (err, resp) => {
        if (err) return next(err);
        res.json(resp.rows);
    });
});

router.post('/', (req, res, next) => {
    const { uid, title, body, username } = req.body;
    const tsVector = `to_tsvector('${title} ${body} ${username}')`;
    pool.query(`INSERT INTO posts(title, body, search_vector, user_id, author, date_created)
        VALUES('${title}', '${body}', ${tsVector}, '${uid}', '${username}', NOW()::timestamp)`, [], (err, resp) => {
            if (err) return next(err);
            res.json(resp.rows);
    });
});

router.get('/search', (req, res, next) => {
    const query = String(req.query.query);
    const tsQuery = `to_tsquery('${query}')`;
    pool.query(`SELECT * FROM posts 
        WHERE search_vector @@ ${tsQuery}`, (err, resp) => {
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
        res.json({ pid: postId });
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
        VALUES('${comment}', '${userId}', '${username}', '${postId}', NOW()::timestamp) RETURNING *`, [])
        .then(resp => {
            res.json(resp.rows[0]);
        })
        .catch(err => {
            return next(err);
        });
});

router.put('/comments', (req, res, next) => {
    const { cid, postId, comment, userId, username } = req.body;
    pool.query(`UPDATE comments SET
        comment='${comment}', user_id=${userId}, post_id=${postId}, author='${username}', date_created=NOW()::timestamp
        WHERE cid=${cid} RETURNING *`, [], (err, resp) => {
            if (err) return next(err);
            res.json(resp.rows[0]);
    });
});

router.delete('/comment', (req, res, next) => {
    const { cid } = req.body
    pool.query(`DELETE FROM comments
        WHERE cid=${cid} RETURNING *`, [], (err, resp) => {
            if (err) return next(err);
            res.json(resp.rows[0]);
    });
});

router.delete('/', (req, res, next) => {
    const { cId } = req.body;
    pool.query(`DELETE FROM comments WHERE cid=${cId}`, [], (err, resp) => {
        if (err) return next(err);
        res.json(resp.rows);
    });
});

router.get('/:pid', (req, res, next) => {
    const { pid } = req.params;
    if (!pid) return res.status(400);
    const query = `SELECT * FROM posts WHERE pid=${pid} LIMIT 1`;
    pool.query(query, (err, resp) => {
        if (err) return next(err);
        if (!resp.rows.length) return res.status(404).send('Post not Found');
        return res.status(200).json(resp.rows[0]);
    });
});

module.exports = router;
