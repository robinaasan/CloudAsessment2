// const {
//   ElastiCacheClient,
//   AddTagsToResourceCommand,
// } = require('@aws-sdk/client-elasticache');
//const redis = require('redis');
const foldername = 'tensorPictures';
//const elasticache = new ElastiCacheClient({ region: 'ap-southeast-2' });

const redisClient = redis.createClient({
  url: 'redis://iverrobredis.km2jzi.ng.0001.apse2.cache.amazonaws.com:6379',
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.log(err);
  }
})();

const params = {
  key: foldername,
  value: 'hellpo',
};
//const command = new AddTagsToResourceCommand(params);

let test = async () => {
  try {
    //const data = await elasticache.send(command);
    redisClient.setEx(foldername, 900, 'hellooooo');
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};
test();

// async function checkRedis() {
//   const result = await redisClient.get(foldername);
//   if (result) {
//     const resultStr = JSON.parse(result);
//     //return resultStr;
//   } else {
//     // const params = {
//     //   key: foldername,
//     //   value: JSON.stringify(theImages),
//     // };
//     const params = {
//       key: foldername,
//       value: 'hellpo',
//     };
//     const command = new AddTagsToResourceCommand(params);
//     try {
//       const data = await elasticache.send(command);
//       console.log('data is:', data);
//     } catch (err) {
//       console.log(err);
//     }
//     //redisClient.setEx(foldername, 900, JSON.stringify(theImages));
//   }
// }

//checkRedis();
