const AWS = require('aws-sdk');
const { REGION, SECRET_ACCESS_KEY, ACCESS_KEY_ID } = require('./constants');

const s3 = new AWS.S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION,
});

module.exports = s3;
