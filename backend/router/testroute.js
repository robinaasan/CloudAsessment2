const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  console.log('initialized!');
});

module.exports = router;
