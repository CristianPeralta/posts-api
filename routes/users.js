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

router.post('/', (req, res, next) => {
  const { nickname, email, emailVerified } = req.body;
  pool.query(`INSERT INTO users(username, email, email_verified, date_created)
      VALUES(${nickname}, ${email}, ${emailVerified}, NOW()) ON CONFLICT DO NOTHING`, [], (err, resp) => {
          if (err) return next(err);
          res.json(resp.rows);
  });
});

module.exports = router;
