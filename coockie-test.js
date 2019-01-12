const Keygrip = require("keygrip");

const keys = require("./config/keys");

const cookieKey = keys.cookieKey;

const session =
  "eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNWMzMDg5MzUyYmNmNDE1NTI2ODkxZGIzIn19";

const keygrip = new Keygrip([keys.cookieKey]);

console.log(keygrip.sign("session=" + session));

console.log(
  keygrip.verify("session=" + session, "qjb83ViVCKLviPicvI8ARPrO_Gs")
);
