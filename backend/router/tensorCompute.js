const { Router } = require('express');
const router = Router();
const tf = require('@tensorflow/tfjs-node');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

async function runModel(picture1Buffer, picture2Buffer) {
  let model;

  if (!model) {
    model = await tf.loadGraphModel(`file://style_transfer_tfjs/model.json`);
  }

  const bytePic1 = picture1Buffer;
  const bytePic2 = picture2Buffer;
  const turtleFin = tf.tidy(() => {
    const turtleTensor = tf.node.decodeImage(bytePic1);
    const turtleNormalized = preprocess(turtleTensor);
    return turtleNormalized;
  });

  const waveFin = tf.tidy(() => {
    const waveTensor = tf.node.decodeImage(bytePic2);
    const waveNormalized = preprocess(waveTensor);
    return waveNormalized;
  });
  let resultTens = model.execute([turtleFin, waveFin]);
  const newImage = await tf.node.encodePng(resultTens.squeeze());
  return newImage;
}

function preprocess(imageTensor) {
  const offset = tf.scalar(255.0);
  const normalized = tf.scalar(1.0).sub(imageTensor.div(offset));
  const batched = normalized.expandDims(0);
  return batched;
}

function encode(data) {
  let buf = Buffer.from(data);
  let base64 = buf.toString('base64');
  return base64;
}

function getS3Object(bucketObject) {
  return new Promise(function (res, rej) {
    const dataTurtleObject = s3.getObject(bucketObject).promise();
    dataTurtleObject.then((data) => {
      res(data);
    });
  });
}

router.post('/', async (req, res) => {
  // Tensor code
  const file = req.files.file1;
  const bucket = JSON.parse(req.body.bucket);
  const file2 = await getS3Object(bucket);
  const bufferDatafile1 = file.data;
  const bufferDatafile2 = file2.Body;
  (async function () {
    let resultPic = await runModel(bufferDatafile1, bufferDatafile2);
    resultPic = encode(resultPic);
    res.status(200).send(resultPic);
  })();
});

module.exports = router;
