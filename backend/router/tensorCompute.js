const { Router } = require('express');
const router = Router();
/*import { AWS } from "aws-sdk";
import dotenv from "dotenv";*/
require('dotenv').config();
const AWS = require('aws-sdk');
//const tf = require('@tensorflow/tfjs');
const { createCanvas } = require('canvas');
const tf = require('@tensorflow/tfjs-node');
const bufsize = require('buffer-image-size');
const { tensor } = require('@tensorflow/tfjs-node');
const fs = require('fs');
const jpeg = require('jpeg-js');
const ImageData = require('@canvas/image-data');

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

async function runModel() {
  let model;

  if (!model) {
    model = await tf.loadGraphModel(`file://style_transfer_tfjs/model.json`);
  }

  console.log('model' + model);

  const bucketName = 'robiv-tensorpics';
  const key = 'pic'; // bruke senere det vi får inn fra den andre routen
  const s3KeyTurtle = `Green_Sea_Turtle_grazing_seagrass.jpg`;
  const s3KeyWave = `The_Great_Wave_off_Kanagawa.jpg`;

  const bucket1 = {
    Bucket: bucketName,
    Key: s3KeyTurtle,
  };

  const bucket2 = {
    Bucket: bucketName,
    Key: s3KeyWave,
  };

  // const byteTurtle = await getImageTurtle(bucket1);
  // const byteWave = await getImageTurtle(bucket2);

  //const byteTurtle = ; // buffer 1
  //const byteWave = ; // buffer 2

  // const stringTur = encode(byteTurtle.Body);
  // const stringWav = encode(byteWave.Body);

  console.log(byteTurtle.Body);
  console.log(byteWave.Body);

  let test = encode(byteTurtle.Body);

  const turtleFin = tf.tidy(() => {
    const turtleTensor = tf.node.decodeImage(byteTurtle.Body);
    //const waveTensor = tf.node.decodeImage(byteWave.Body);
    //const turtleTensor1 = tf.node.decodeImage(byteTurtle.Body, 1);
    console.log('turtletens ' + turtleTensor.shape);
    //console.log('wave ' + waveTensor.shape);
    //console.log('turtletens1 ' + turtleTensor1.shape);
    const turtleNormalized = preprocess(turtleTensor);
    //const waveNormalized = preprocess(waveTensor);

    console.log(turtleNormalized);
    //console.log(waveNormalized);

    return turtleNormalized;
  });

  const waveFin = tf.tidy(() => {
    //const turtleTensor = tf.node.decodeImage(byteTurtle.Body);
    const waveTensor = tf.node.decodeImage(byteWave.Body);
    //const turtleTensor1 = tf.node.decodeImage(byteTurtle.Body, 1);
    //console.log('turtletens ' + turtleTensor.shape);
    console.log('wave ' + waveTensor.shape);
    //console.log('turtletens1 ' + turtleTensor1.shape);
    //const turtleNormalized = preprocess(turtleTensor);
    const waveNormalized = preprocess(waveTensor);

    console.log(waveNormalized);
    //console.log(waveNormalized);

    return waveNormalized;
  });

  console.log('turtlefin: ' + turtleFin.shape);
  console.log('wavefin: ' + waveFin.shape);

  let resultTens = model.execute([turtleFin, waveFin]);

  console.log('result: ' + resultTens);

  const newImage = await tf.node.encodeJpeg(resultTens.squeeze());
  console.log(resultTens.shape);

  //const im = Buffer.from(newImage);
  //console.log('im    xs' + im);

  //fs.writeFileSync('newfile.jpeg', im);

  let newRes = encode(newImage.buffer);
  console.log('bildet: ' + newImage);
  console.log('bildet index: ' + newImage.length);
  console.log(typeof newImage);

  let result = encode(newImage);

  if (result === newRes) {
    console.log('lik"!EWEERBERTB');
  }

  const returnImageNew = toImageFTensor(resultTens);
  console.log(typeof returnImageNew);
  console.log(returnImageNew);
  // TEST XXXXXXX
  var width = 100,
    height = 100;
  var frameData = new Buffer(width * height);
  console.log('lengde framedata: ' + frameData.length);
  var i = 0;
  while (i < frameData.length) {
    frameData[i++] = newImage[i]; // red
    frameData[i++] = newImage[i + 1]; // green
    frameData[i++] = newImage[i + 2]; // blue
    //frameData[i++] = 0xff; // alpha - ignored in JPEGs
  }
  var rawImageData = {
    data: frameData,
    width: width,
    height: height,
  };
  console.log('dette er framedata: ' + frameData);
  var jpegImageData = jpeg.encode(rawImageData, 100);
  console.log(jpegImageData);
  /*
  { width: 320,
    height: 180,
    data: <Buffer 5b 40 29 ff 59 3e 29 ff 54 3c 26 ff 55 3a 27 ff 5a 3e 2f ff 5c 3c 31 ff 58 35 2d ff 5b 36 2f ff 55 35 32 ff 5a 3a 37 ff 54 36 32 ff 4b 32 2c ff 4b 36 ... > }
  */
  // write to file
  fs.writeFileSync('image.jpg', jpegImageData.data);
  var dimensionsTur = bufsize(byteTurtle.Body); // height width turtle
  var dimensionsWav = bufsize(byteWave.Body); // height width turtle

  // console.log(byteTurtle);
  // console.log(byteWave);
  // console.log(dimensionsTur.height, dimensionsTur.width);
  // console.log(dimensionsWav.height, dimensionsWav.width);

  // //var tensorTurtle = tf.tensor(byteTurtle.Body).reshape([dimensionsTur.height, dimensionsTur.width, -1]);
  // //var tensorWave = tf.tensor(byteWave.Body).reshape([dimensionsWav.height, dimensionsWav.width, -1]);
  // var tensorTurtle = tf.tensor(byteTurtle.Body);//.reshape([1, 1, 29042]);
  // var tensorWave = tf.tensor(byteWave.Body);//.reshape([dimensionsWav.height, dimensionsWav.width, -1]);

  // console.log(tensorTurtle);
  // console.log(tensorWave);

  // //const tensorTurtleFin = preprocess(tensorTurtle);
  // //const tensorWaveFin = preprocess(tensorWave);
  // const tensorTurtleFin = preprocess(tensorTurtle, [dimensionsTur.height, dimensionsTur.width, -1]);
  // const tensorWaveFin = preprocess(tensorWave, tensorWave.shape);

  // console.log('preproc turle' + tensorTurtleFin);
  // console.log('preproc wave' + tensorWaveFin);

  // let result = model.execute([tensorTurtleFin, tensorWaveFin]);

  // console.log(result);
  // // let Img1 = encode(byteTurtle.Body);
  // // let styleImg1 = encode(byteWave.Body);

  // // let Img1ID = toImageDataFromBase64(Img1);
  // // let styleImg1ID = toImageDataFromBase64(styleImg1);
  // // console.log(Img1ID);
  // // console.log(styleImg1ID);

  // /*var Img = document.createElement('img');
  // Img.src = "data:image/png;base64," + Img1;

  // var styleImg = document.createElement('img');
  // styleImg.src = "data:image/png;base64," + styleImg1;*/

  // // const imageTensor = preprocess(Img1ID);
  // // const styleImageTensor = preprocess(styleImg1ID);

  // // Swap imagetensor and styleIT for desired output
  // //let result = model.execute([imageTensor, styleImageTensor]);
  // //tf.browser.toPixels(tf.squeeze(result), canvas);

  return newImage.buffer;
}

function toImageFTensor(tensor) {
  var canvas = createCanvas();
  var ctx = canvas.getContext('2d');
  const [height, width] = tensor.shape;
  //create a buffer array
  const buffer = new Uint8ClampedArray(width * height * 4);
  //create an Image data var
  const imageData = new ImageData(width, height);
  //get the tensor values as data
  const data = tensor.dataSync();
  //map the values to the buffer
  var i = 0;
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var pos = (y * width + x) * 4; // position in buffer based on x and y
      buffer[pos] = data[i]; // some R value [0, 255]
      buffer[pos + 1] = data[i + 1]; // some G value
      buffer[pos + 2] = data[i + 2]; // some B value
      buffer[pos + 3] = 255; // set alpha channel
      i += 3;
    }
  }
  //set the buffer to the image data
  imageData.data.set(buffer);
  //show the image on canvas
  //ctx.putImageData(imageData, 0, 0)
  //console.log(imageData);

  return imageData;
}

function preprocess(imageTensor) {
  //let imageTensor = tf.browser.fromPixels(imageData); // convert image to a tensor
  //let imageTensor = tf.FromPixels(imageData); // convert image to a tensor
  //var imageTensor = tf.tensor3d(imageData, shape); // image to tensor
  const offset = tf.scalar(255.0);
  const normalized = tf.scalar(1.0).sub(imageTensor.div(offset));
  const batched = normalized.expandDims(0);
  console.log('batched' + batched);
  return batched;
}

// async function getImageTurtle(bucket) {
//   const dataTurtle = s3.getObject(bucket).promise();
//   dataTurtle.then((data) => { console.log(data) });
// }

const getImageTurtle = function (bucket) {
  return new Promise(function (res) {
    const dataTurtle = s3.getObject(bucket).promise();
    dataTurtle.then((data) => {
      res(data);
    });
  });
};

function encode(data) {
  let buf = Buffer.from(data);
  let base64 = buf.toString('base64');
  return base64;
}

function toImageDataFromBase64(string) {
  const image = new Image();

  const canvas = createCanvas();
  var context = canvas.getContext('2d');

  image.onload = function () {
    context.drawImage(image, 0, 0);
    var height = image.height;
    var width = image.width;
    canvas.width = width;
    canvas.height = height;
    console.log('height' + height);
    console.log('width' + width);
    context.clearRect(0, 0, width, height);
    image.src = string;

    return context.getImageData(0, 0, width, height);
  };
}

function drawCanvas(string) {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');

  ctx.drawImage('data:image/jpg;base64,' + string, 50, 0, 70, 70);
  return canvas;

  // canvas.width = width;
  // canvas.height = height;

  console.log('Cheight' + canvas.height);
  console.log('Cwidth' + canvas.width);

  //image.onload = () => context.drawImage(image, 0, 0);
}

// avatar.onload = () => ctx.drawImage(avatar, 50, 50)
// avatar.src = res.body

router.get('/', (req, res) => {
  console.log('initialized!');

  /*getImageTurtle(bucket1)
    .then((img) => {
      let imageTurtle = encode(img.Body);
      bilde1 = imageTurtle;
      //liste.push(imageTurtle);
    })
    .catch((e) => {
      console.log(e);
    });*/

  /*getImageWave(bucket2)
    .then((img) => {
      let imageWave = encode(img.Body);
      bilde2 = imageWave;
      console.log(bilde2);
    })
    .catch((e) => {
      console.log(e);
    });*/

  //const img = "data:image/jpg;base64," + bilde1;
  //const styleImg = "data:image/jpg;base64," + bilde2;

  // Tensor code

  async function getData() {
    let resultPic = await runModel();
    console.log('sender til client pic: ' + resultPic);
    res.send(resultPic);
  }

  getData();
});

module.exports = router;
