const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

let vgg19model;

async function runModel() {
  if (!vgg19model) {
    vgg19model = await tf.loadLayersModel(
      `file://vgg19-tensorflowjs-model/model/model.json`
    );
  }
  // if (!vgg19modelGraph) {
  //   vgg19model = await tf.loadGraphModel(
  //     `file://vgg19-tensorflowjs-model/model/model.json`
  //   );
  // }
  //console.log(vgg19model);



  // var img = new Image();
  // img.src = 'router/img/Green_Sea_Turtle_grazing_seagrass.jpg';

  // var styleImg = new Image();
  // styleImg.src = 'router/img/The_Great_Wave_off_Kenagawa.jpg.jpg';

  const imageTensor = preprocess(img);
  const styleImageTensor = preprocess(styleImg);

  // Swap imagetensor and styleIT for desired output
  let result = model.execute([imageTensor, styleImageTensor]);

   tf.browser.toPixels(tf.squeeze(result), canvas);

  //console.log(vgg19modelGraph);
}
runModel();

function preprocess(imageData){
  let imageTensor = tf.browser.fromPixels(imageData); // convert image to a tensor
  const offset = tf.scalar(255.0);
  const normalized = tf.scalar(1.0).sub(imageTensor.div(offset));
  const batched = normalized.expandDims(0);
  return batched;
}



