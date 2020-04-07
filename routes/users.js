const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const email = String(req.query.email);
  pool.query(`SELECT * FROM users WHERE email=${email}`, [], (err, resp) => {
    if (err) return next(err);
    res.json(resp.rows);
  });
});

module.exports = router;
