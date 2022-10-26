const { Router } = require('express');
const router = Router();
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

router.get('/', async (req, res) => {
  //should use vgg19 and return mashup photo of the ones in the img folder
  const vgg19 = await tf.loadLayersModel(
    `file://vgg19-tensorflowjs-model/model/model.json`
  );
  console.log(vgg19);
});
