const { Router } = require('express');
const router = Router();
const redis = require('redis');
require('dotenv').config();
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const foldername = 'tensorPictures';
const redisClient = redis.createClient(
  'redis://iverrob-tensor.km2jzi.ng.0001.apse2.cache.amazonaws.com:6379'
);

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.log(err);
  }
})();

async function checkRedis() {
  const result = await redisClient.get(foldername);
  if (result) {
    const resultStr = JSON.parse(result);
    return resultStr;
  } else {
    const theImages = await checkS3(foldername);
    redisClient.setEx(foldername, 900, JSON.stringify(theImages));
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

async function checkS3(s3key) {
  listBytes = [];
  const s3Key = s3key;
  const bucketName = 'robiv-tensorpics';
  const bucket = { Bucket: bucketName, Prefix: s3Key };
  const getPic = await getImageList(bucket);

  for (i = 1; i < getPic.Contents.length; i++) {
    let bucketLink = {
      Bucket: bucketName,
      Key: getPic.Contents[i].Key,
    };
    let bucketObject = { Bucket: bucketName, Key: getPic.Contents[i].Key };
    let values = await getImages(bucketLink, bucketObject);
    listBytes.push(values);
  }

  return listBytes;
}

const getImages = function (bucketLink, bucketObject) {
  return new Promise(function (res) {
    const dataTurtleLink = s3.getSignedUrl('getObject', bucketLink);
    let result = {
      dataTurtleLink,
      bucketObject,
    };
    res(result);
  });
};

router.get('/', async (req, res) => {
  const responsen = await checkRedis();
  res.status(200).send(responsen);
});

module.exports = router;
