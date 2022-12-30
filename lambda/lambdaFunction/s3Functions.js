const AWS = require("aws-sdk");
const S3 = new AWS.S3();

const retrieveThoughts = async (userId) => {
  const data = await S3.getObject({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `users/${userId}/thoughts.json`,
  }).promise();

  return data.Body.toString("utf-8");
};

const saveThoughts = async (userId, thoughts) => {
  console.log("sacing", userId, [thoughts]);
  const data = await S3.putObject({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `users/${userId}/thoughts.json`,
    Body: JSON.stringify(thoughts),
    ContentType: "application/json",
  }).promise();

  return data;
};

module.exports.retrieveThoughts = retrieveThoughts;
module.exports.saveThoughts = saveThoughts;
