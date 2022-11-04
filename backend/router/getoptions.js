const { Router } = require('express');
require('dotenv').config();
const AWS = require('aws-sdk');
const router = Router();

const path_to_folder = '/mashoptions';
const bucket = 'robiv-tensorpics';
const params = { Bucket: bucket, Delimiter: path_to_folder };
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

router.get('/', async (req, res) => {
  //check redis if not...
  try {
    let objectsinBucket = await getObjectsFromS3(params);
    res.status(200).send;
  } catch {
    //do something
  }
});

const getObjectsFromS3 = function (params) {
  return new Promise((res, rej) => {
    s3.listObjects(params, (err, data) => {
      if (err) {
        console.log(err);
        rej(err);
      } else {
        //console.log(data);
        //if data get all the objects
        if (data.Contents.length != 0) {
          let objectsInBucket = [];
          data.Contents.forEach((element) => {
            //get objects and push to the list
            let bucketParams = { Bucket: bucket, Key: element.Key };
            s3.getObject(bucketParams, (err, data) => {
              if (err) {
                rej(err);
              } else {
                objectsInBucket.push(data);
                //console.log(data.Body.toString('utf-8'));
              }
            });
          });
          res(objectsInBucket);
        } else {
          rej({ msg: 'no data in the bucket' });
        }
      }
    });
  });
};
module.exports = router;
