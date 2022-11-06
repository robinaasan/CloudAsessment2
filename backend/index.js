const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const tensorRoute = require('./router/tensorCompute');
const persistence = require('./router/persistenceCheck');

require('dotenv').config();

const app = express();
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/tensorCompute', tensorRoute);
app.use('/api/persistenceCheck', persistence);
app.use(express.static('../image-generator/dist'));

app.listen(process.env.PORT, () =>
  console.log(`App listening at http://localhost:${process.env.PORT}`)
);
