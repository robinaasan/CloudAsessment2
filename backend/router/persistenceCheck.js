const { Router } = require('express');
const router = Router();
const axios = require('axios');
const redis = require('redis');
require('dotenv').config();
const AWS = require('aws-sdk');

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const redisClient = redis.createClient();
(async () => {
  try {
    await redisClient.connect();
    console.log('funker');
  } catch (err) {
    console.log(err);
  }
})();

async function checkRedis(redisKey) {
  const result = await redisClient.get(redisKey);
  if (result) {
    // Serve from redis
    console.log('Running redis');
    const resultStr = JSON.parse(result); // ikke sikkert vi trenger denne heller
    return resultStr; // ??????
  } else {
    // key not in redis, serve from S3 and store in redis
    console.log('ikke i redis');
    const theImages = await checkS3(redisKey);
    console.log(typeof theImages);
    //const redisImages = []; //liste med verdier fra S3 her
    redisClient.setEx(redisKey, 900, JSON.stringify(theImages));
    return theImages;
  }
}

const getImageList = function (bucket) {
  return new Promise(function (res) {
    const dataImg = s3.listObjectsV2(bucket).promise();
    dataImg.then((data) => {
      res(data);
    });
  });
};

// function encode(data) {
//   let buf = Buffer.from(data);
//   let base64 = buf.toString('base64');
//   return base64;
// }

async function checkS3(s3key) {
  // Serve from S3
  listBytes = [];
  const s3Key = s3key; // folder prefix
  const bucketName = 'robiv-tensorpics';
  const bucket = { Bucket: bucketName, Prefix: s3Key };
  const getPic = await getImageList(bucket);
  //console.log(getPic.Contents[1].Key);
  for (i = 1; i < getPic.Contents.length; i++) {
    let bucket1 = {
      Bucket: bucketName,
      Key: getPic.Contents[i].Key,
      Expires: 60,
    };
    let values = await getImages(bucket1);
    listBytes.push(values);
  }
  //console.log(listBytes);
  return listBytes;
}

const getImages = function (bucket) {
  return new Promise(function (res) {
    const dataTurtle = s3.getSignedUrl('getObject', {
      Bucket: bucket.Bucket,
      Key: bucket.Key,
      Expires: bucket.Expires,
    });
    res(dataTurtle);
  });
};

router.get('/:key', async (req, res) => {
  const key = req.params.key; // folder prefix
  console.log(key);
  const responsen = await checkRedis(key);
  //(responsen['Contents'][0]['Key']);
  console.log(responsen);

  //   responsen.forEach((element, index) => {
  //     responsen[index] = encode(element);
  //   });
  //console.log(responsen);
  res.status(200).send(responsen);
});

module.exports = router;
