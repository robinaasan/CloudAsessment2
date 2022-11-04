const { Router } = require('express');
const router = Router();
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const jpeg = require('jpeg-js');

async function runModel(picture1, picture2) {
  let model;

  if (!model) {
    model = await tf.loadGraphModel(`file://style_transfer_tfjs/model.json`);
  }

  const bytePic1 = picture1.data; // buffer 1
  const bytePic2 = picture2.data; // buffer 2


  const turtleFin = tf.tidy(() => {
    const turtleTensor = tf.node.decodeImage(bytePic1);
    //console.log('turtletens ' + turtleTensor.shape);
    const turtleNormalized = preprocess(turtleTensor);
    //console.log(turtleNormalized);
    return turtleNormalized;
  });

  const waveFin = tf.tidy(() => {
    const waveTensor = tf.node.decodeImage(bytePic2);
    //console.log('wave ' + waveTensor.shape);
    const waveNormalized = preprocess(waveTensor);
    //console.log(waveNormalized);
    return waveNormalized;
  });

  //console.log('turtlefin: ' + turtleFin.shape);
  //console.log('wavefin: ' + waveFin.shape);

  let resultTens = model.execute([turtleFin, waveFin]);

  //console.log('result: ' + resultTens);

  const newImage = await tf.node.encodePng(resultTens.squeeze());
  //console.log(resultTens.shape);

  //let newRes = encode(newImage.buffer);
  // console.log('bildet: ' + newImage);
  // console.log('bildet index: ' + newImage.length);
  // console.log(typeof newImage);

  //let result = encode(newImage);

  // TEST XXXXXXX
  // var width = 100,
  //   height = 100;
  // var frameData = new Buffer(width * height);
  // console.log('lengde framedata: ' + frameData.length);
  // var i = 0;
  // while (i < frameData.length) {
  //   frameData[i++] = newImage[i]; // red
  //   frameData[i++] = newImage[i + 1]; // green
  //   frameData[i++] = newImage[i + 2]; // blue
  //   //frameData[i++] = 0xff; // alpha - ignored in JPEGs
  // }
  // var rawImageData = {
  //   data: frameData,
  //   width: width,
  //   height: height,
  // };
  // console.log('hei framedata');
  // console.log(encode(frameData));
  // var jpegImageData = jpeg.encode(rawImageData, 100);
  // console.log(jpegImageData);
  // // write to file
  // fs.writeFileSync('image.jpg', jpegImageData.data);
  // TEST XXXXX


  return newImage;
}

function preprocess(imageTensor) {
  //let imageTensor = tf.browser.fromPixels(imageData); // convert image to a tensor
  //let imageTensor = tf.FromPixels(imageData); // convert image to a tensor
  //var imageTensor = tf.tensor3d(imageData, shape); // image to tensor
  const offset = tf.scalar(255.0);
  const normalized = tf.scalar(1.0).sub(imageTensor.div(offset));
  const batched = normalized.expandDims(0);
  //console.log('batched' + batched);
  return batched;
}


function encode(data) {
  let buf = Buffer.from(data);
  let base64 = buf.toString('base64');
  return base64;
}

router.post('/', (req, res) => {
  console.log('initialized!');


  // Tensor code
  const files = req.files;
  //console.log(files); // buffer hvert bilde
  async function getData() {
    let resultPic = await runModel(files.file1, files.file2);
    //console.log('sender til client pic: ' + encode(resultPic));
    resultPic = encode(resultPic);
    res.send(resultPic);
  }
  getData();
});

module.exports = router;
