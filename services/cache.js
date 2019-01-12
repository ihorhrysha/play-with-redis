const mongoose = require("mongoose");
const keys = require("../config/keys");

const redis = require("redis");
const client = redis.createClient(keys.redisURI);

const util = require("util");
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || "");
  this.refreshTime = options.refreshTime || 120;

  return this;
};

mongoose.Query.prototype.exec = async function() {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(
    Object.assign(
      {},
      {
        collection: this.mongooseCollection.name
      },
      this.getQuery()
    )
  );

  const cachedData = await client.hget(this.hashKey, key);

  if (cachedData) {
    console.log("from cache", key);
    const docOrArr = JSON.parse(cachedData);

    return Array.isArray(docOrArr)
      ? (cachedDataToModel = docOrArr.map(doc => new this.model(doc)))
      : (cachedDataToModel = new this.model(docOrArr));
  }

  const result = await exec.apply(this, arguments);

  client.hset(this.hashKey, key, JSON.stringify(result));
  console.log("from DB", key);

  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
};
