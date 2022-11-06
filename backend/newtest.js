const redis = require('redis');
const foldername = 'tensorPictures';
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

const theImages = {
  links: { links: ['link1', 'link2'] },
  oebjct: {
    key: 'something1',
    two: 'somethingelse',
  },
};

async function checkRedis() {
  const result = await redisClient.get(foldername);
  if (result) {
    const resultStr = JSON.parse(result);
    console.log('Was already stored!', resultStr);
    return resultStr;
  } else {
    //const theImages = await checkS3(foldername);
    redisClient.setEx(foldername, 900, JSON.stringify(theImages));
    console.log('Was NOT stored!');
    return theImages;
  }
}

checkRedis();
