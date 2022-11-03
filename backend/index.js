const express = require('express');
//const { PORT } = require("./config");
const cors = require('cors'); //TODO: remove after build
const bodyParser = require('body-parser');
const testRoute = require('./router/testroute');
const fileUpload = require('express-fileupload');

require('dotenv').config();

const app = express();
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(bodyParser.json());
app.use(cors()); //TODO: remove after build
app.use('/api/testRoute', testRoute);
app.use('/api/tensor', testRoute);

app.listen(process.env.PORT, () =>
  console.log(`App listening at http://localhost:${process.env.PORT}`)
);
