const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  console.log('initialized!');
});

router.post('/picture', async (req, res) => {
  //const title = req.body.title;
  const file = req.files;

  console.log(file);
  res.status(200).send('got the picture!');
});

module.exports = router;
