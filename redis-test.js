const redis = require("redis");
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);

// client.set("hi", "there");

// client.get("hi", console.log);

client.hset("spanish", "red", "rojo");
client.hget("spanish", "red", console.log);

client.quit();
