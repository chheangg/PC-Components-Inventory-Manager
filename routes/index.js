const express = require('express');
const router = express.Router();

/* Get HOME PAGE */
router.get('/', (req, res) => {
  res.redirect('/catalog');
})

module.exports = router;