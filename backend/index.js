const express = require('express');
//const { PORT } = require("./config");
const cors = require('cors'); //TODO: remove after build
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const testRoutefirst = require('./router/testroute');
const testRoute = require('./router/tensorCompute');
const getOptions = require('./router/getoptions');
//const persistence = require('./router/persistenceCheck');

require('dotenv').config();

const app = express();
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(bodyParser.json());
app.use(cors()); //TODO: remove after build
app.use('/api/tensorCompute', testRoute);
app.use('/api/tensor', testRoute);
//app.use('/api/persistenceCheck', persistence);
app.use('/api/testRoute', testRoutefirst);
app.use('/api/getOptions', getOptions);

app.listen(process.env.PORT, () =>
  console.log(`App listening at http://localhost:${process.env.PORT}`)
);
