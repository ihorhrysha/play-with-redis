const AWS = require("aws-sdk");
const uuid = require("uuid/v1");
const keys = require("../config/keys");
const requireLogin = require("../middlewares/requireLogin");

const s3 = new AWS.S3({
  secretAccessKey: keys.accessKeyId,
  accessKeyId: keys.accessKeyId,
  signatureVersion: "v4",
  region: "eu-central-1"
});

module.exports = app => {
  app.get("/api/upload/", requireLogin, (req, res) => {
    const params = {
      Bucket: "blog-node-adv",
      Key: `${req.user.id}/${uuid()}.jpeg`,
      ContentType: "image/jpeg"
    };

    s3.getSignedUrl("putObject", params, (err, url) => {
      res.send({ params, url });
    });
  });
};
