const express = require('express');
const router = express.Router();
const pool = require("../db");

router.get('/', (req, res) => {
  pool.query("SELECT * FROM posts ORDER BY data_created DESC", (err, resp) => {
      res.json(resp.rows);
  });
});

module.exports = router;
