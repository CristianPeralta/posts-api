import { Router, Response, Request, NextFunction } from 'express';
import pool from '../db';

const router: Router = Router();
/* GET users listing. */
router.get('/', (req: Request, res: Response, next: NextFunction): void => {
    const username: string = String(req.query.username);
    pool.query(`SELECT * FROM users WHERE username='${username}'`, [], (err, resp) => {
        if (err) return next(err);
        res.json(resp.rows[0]);
    });
});

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
    interface RequestData {
        username: string,
        email: string,
        emailVerified: boolean
    }
    const { username, email, emailVerified }: RequestData = req.body;
    pool.query(`INSERT INTO users(username, email, email_verified, date_created)
        VALUES('${username}', '${email}', '${emailVerified}', NOW()) ON CONFLICT DO NOTHING`, [], (err) => {
            if (err) return next(err);
            pool.query(`SELECT * FROM users WHERE username='${username}'`, [], (err, resp) => {
            if (err) return next(err);
            return res.json(resp.rows[0]);
        });
    });
});

router.post('/messages', (req: Request, res: Response, next: NextFunction) => {
    interface RequestData {
        messageSender: string,
        messageTo: string,
        messageTitle: string,
        messageBody: string,
    }
    const { messageSender, messageTo, messageTitle, messageBody }: RequestData = req.body;
    pool.query(`INSERT INTO messages(message_sender, message_to, message_title, message_body, date_created)
      VALUES('${messageSender}', '${messageTo}', '${messageTitle}', '${messageBody}', NOW())  RETURNING *`, [], (err, resp) => {
          if (err) return next(err);
          return res.json(resp.rows[0]);
    });
});

router.get('/messages', (req: Request, res: Response, next: NextFunction) => {
    const username: string = String(req.query.username);
    pool.query(`SELECT * FROM messages WHERE message_to='${username}'`, [], (err, resp) => {
        if (err) return next(err);
        res.json(resp.rows);
    });
});

router.delete('/messages', (req: Request, res: Response, next: NextFunction) => {
    const mid: string = req.body.mid;
    pool.query(`DELETE FROM messages WHERE mid=${mid}`, [], (err) => {
        if (err) return next(err);
        res.json({ mid });
    });
});

export default router;
