const express = require('express');
const router = express.Router();
const pool = require("../db");

/* GET users listing. */
router.get('/', function(req, res, next) {
  const username = String(req.query.username);
  pool.query(`SELECT * FROM users WHERE username='${username}'`, [], (err, resp) => {
    if (err) return next(err);
    res.json(resp.rows);
  });
});

router.post('/', (req, res, next) => {
  const { username, email, emailVerified } = req.body;
  pool.query(`INSERT INTO users(username, email, email_verified, date_created)
    VALUES('${username}', '${email}', '${emailVerified}', NOW()) ON CONFLICT DO NOTHING`, [], (err, resp) => {
        if (err) return next(err);
        pool.query(`SELECT * FROM users WHERE username='${username}'`, [], (err, resp) => {
          if (err) return next(err);
          return res.json(resp.rows[0]);
        });
  });
});

router.post('/messages', (req, res, next) => {
  const { messageSender, messageTo, messageTitle, messageBody } = req.body;
  pool.query(`INSERT INTO messages(message_sender, message_to, message_title, message_body, date_created)
    VALUES('${messageSender}', '${messageTo}', '${messageTitle}', '${messageBody}', NOW())`, [], (err, resp) => {
        if (err) return next(err);
          return res.json(resp.rows[0]);
  });
});


router.get('/messages', function(req, res, next) {
  const username = String(req.query.username);
  pool.query(`SELECT * FROM messages WHERE message_to='${username}'`, [], (err, resp) => {
    if (err) return next(err);
    res.json(resp.rows);
  });
});

router.delete('/messages', (req, res, next) => {
  const { mid } = req.body;
  pool.query(`DELETE FROM messages WHERE mid=${mid}`, [], (err, resp) => {
      if (err) return next(err);
      res.json({ mid });
  });
});

module.exports = router;
