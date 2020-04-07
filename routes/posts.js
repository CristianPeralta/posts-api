const express = require('express');
const router = express.Router();
const pool = require("../db");

router.get('/', (req, res) => {
  pool.query("SELECT * FROM posts ORDER BY data_created DESC", (err, resp) => {
      res.json(resp.rows);
  });
});

router.post('/', (req, res, next) => {
    const { uid, title, body, username } = req.body;
    pool.query(` *INSERT INTO posts(title, body, user_id, author, date_created)
        VALUES(${title}, ${body}, ${uid}, ${username}, NOW())`, [], (err, resp) => {
            if (err) return next(err);
            res.json(resp.rows);
    });
  });
  
module.exports = router;
