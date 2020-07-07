import { Router, Request, Response, NextFunction } from 'express';
import pool from '../db';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    let where: string = 'WHERE';
    if (req.query.query) {
        const tsQuery: string = `to_tsquery('${String(req.query.query)}')`;
        where = `${where} search_vector @@ ${tsQuery}`;
    }
    if (req.query.username) {
        const username: string = String(req.query.username);
        where = `${where} author='${username}'`;
    }
    if (req.query.userId) {
        const userId: number = Number(req.query.userId);
        where = `${where} user_id='${userId}'`;
    }
    const select: string = `SELECT * FROM posts `;
    const orderBy: string = `ORDER BY date_created DESC`;
    const query: string = `${select} ${where !== 'WHERE' ? where : ''} ${orderBy}`;
    pool.query(query, (err, resp) => {
        if (err) return next(err);
        return res.status(200).json(resp.rows);
    });
});

router.put('/likes', (req: Request, res: Response, next: NextFunction) => {
    const uid: string = req.body.uid;
    const pid: string = String(req.body.postId);
    pool.query(`UPDATE posts SET like_user_id=like_user_id || ${[uid]}, likes=likes + 1
        WHERE NOT (like_user_id @> ARRAY[${uid}]) AND pid=${pid} RETURNING *`, [], (err) => {
            if (err) return next(err);
            pool.query(`SELECT * FROM posts WHERE pid=${pid}`, [], (err, response) => {
                if (err) return next(err);
                return res.json(response.rows[0]);
            });
    });
});

router.get('/user', (req: Request, res: Response, next: NextFunction) => {
    const userId: number= Number(req.query.userId);
    pool.query(`SELECT * FROM posts 
        WHERE user_id=${userId}`, (err, resp) => {
        if (err) return next(err);
        res.json(resp.rows);
    });
});

router.get('/username', (req: Request, res: Response, next: NextFunction) => {
    const username: string = String(req.query.username);
    pool.query(`SELECT * FROM posts 
        WHERE author='${username}'`, (err, resp) => {
        if (err) return next(err);
        res.json(resp.rows);
    });
});

router.post('/', (req, res, next) => {
    interface RequestData {
        uid: number,
        title: string,
        body: string,
        username: string,
    }
    const { uid, title, body, username }: RequestData = req.body;
    const tsVector: string = `to_tsvector('${title} ${body} ${username}')`;
    pool.query(`INSERT INTO posts(title, body, search_vector, user_id, author, date_created)
        VALUES('${title}', '${body}', ${tsVector}, '${uid}', '${username}', NOW()::timestamp) RETURNING *`, [], (err, resp) => {
            if (err) return next(err);
            res.json(resp.rows[0]);
    });
});

router.get('/search', (req: Request, res: Response, next: NextFunction) => {
    const query: string = String(req.query.query);
    const tsQuery: string = `to_tsquery('${query}')`;
    pool.query(`SELECT * FROM posts 
        WHERE search_vector @@ ${tsQuery}`, (err, resp) => {
        if (err) return next(err);
        res.json(resp.rows);
    });
});

router.put('/', (req: Request, res: Response, next: NextFunction) => {
    interface RequestData {
        uid: number,
        pid: number,
        title: string,
        body: string,
        username: string,
    }
    const { uid, pid, title, body, username }: RequestData = req.body;
    pool.query(`UPDATE posts SET title='${title}', body='${body}', user_id=${uid}, author='${username}', date_created=NOW()::timestamp
        WHERE pid=${pid}`, [], (err, resp) => {
            if (err) return next(err);
            res.json(resp.rows);
    });
});

router.delete('/', (req, res, next) => {
    const postId: string = req.body.postId;
    pool.query(`DELETE FROM posts WHERE pid=${postId}`, [], (err) => {
        if (err) return next(err);
        res.json({ pid: postId });
    });
});

router.delete('/comments', (req: Request, res: Response, next: NextFunction) => {
    const postId: number = req.body.postId;
    pool.query(`DELETE FROM comments WHERE post_id=${postId}`, [], (err, resp) => {
        if (err) return next(err);
        res.json(resp.rows);
    });
});

router.get('/comments', (req: Request, res: Response, next: NextFunction) => {
    const postId: number = Number(req.query.pid);
    pool.query(`SELECT * FROM comments 
        WHERE post_id=${postId} ORDER BY date_created DESC`, (err, resp) => {
            if (err) return next(err);
            res.json(resp.rows);
    });
});

router.post('/comments', (req: Request, res: Response, next: NextFunction) => {
    interface RequestData {
        postId: number,
        userId: number,
        comment: string,
        username: string,
    }
    const { postId, comment, userId, username }: RequestData = req.body;
    pool.query(`INSERT INTO comments(comment, user_id, author, post_id, date_created)
        VALUES('${comment}', '${userId}', '${username}', '${postId}', NOW()::timestamp) RETURNING *`, [])
        .then(resp => {
            res.json(resp.rows[0]);
        })
        .catch(err => {
            return next(err);
        });
});

router.put('/comments', (req: Request, res: Response, next: NextFunction) => {
    interface RequestData {
        cid: number,
        postId: number,
        userId: number,
        comment: string,
        username: string,
    }
    const { cid, postId, comment, userId, username }: RequestData = req.body;
    pool.query(`UPDATE comments SET
        comment='${comment}', user_id=${userId}, post_id=${postId}, author='${username}', date_created=NOW()::timestamp
        WHERE cid=${cid} RETURNING *`, [], (err, resp) => {
            if (err) return next(err);
            res.json(resp.rows[0]);
    });
});

router.delete('/comment', (req: Request, res: Response, next: NextFunction) => {
    const cid: number = req.body.cid;
    pool.query(`DELETE FROM comments
        WHERE cid=${cid} RETURNING *`, [], (err, resp) => {
            if (err) return next(err);
            res.json(resp.rows[0]);
    });
});

router.delete('/', (req: Request, res: Response, next: NextFunction) => {
    const cId: number = req.body.cid;
    pool.query(`DELETE FROM comments WHERE cid=${cId}`, [], (err, resp) => {
        if (err) return next(err);
        res.json(resp.rows);
    });
});

router.get('/:pid', (req: Request, res: Response, next: NextFunction) => {
    const pid: number = Number(req.params.pid);
    if (!pid) return res.status(400);
    const query: string = `SELECT * FROM posts WHERE pid=${pid} LIMIT 1`;
    pool.query(query, (err, resp) => {
        if (err) return next(err);
        if (!resp.rows.length) return res.status(404).send('Post not Found');
        return res.status(200).json(resp.rows[0]);
    });
});

export default router;
