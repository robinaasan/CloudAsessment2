const express = require('express');
 
// Creating express object
const app = express();
 
// Defining port number
const PORT = 3000;   

const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
// const handler = tfn.io.fileSystem(
//   'https://vgg19-tensorflowjs-model/model/model.json'
// );
//require('@tensorflow/tfjs-node');

//should use vgg19 and return mashup photo of the ones in the img folder

let vgg19model;

async function runModel() {
  if (!vgg19model) {
    vgg19model = await tf.loadLayersModel(
      `file://vgg19-tensorflowjs-model/model/model.json`
    );
    console.log(vgg19model);
  }
  const myImage = new Image(200, 200);
  myImage.src = 'Green_Sea_Turtle_grazing_seagrass.jpg';
}

// function loadPicture(path_to_picture) {
//   let max_dim = 512;
//   img = tf.image.
// }

runModel();
