const keys = require("algaeh-keys");
const crypto = require("crypto");
const Redis = require("ioredis");
const redis = new Redis(keys.redis);

module.exports = {
  getFromRedis: name => {
    return new Promise((resolve, reject) => {
      try {
        redis.get(name, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  },
  setToRedis: (name, value) => {
    return new Promise((resolve, reject) => {
      try {
        redis.set(name, value);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  mSetToRedis: options => {
    return new Promise((resolve, reject) => {
      try {
        redis.mset(options);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  hSetUser: (name, userInformation) => {
    return new Promise((resolve, reject) => {
      try {
        redis.hmset(`user:${name}`, userInformation);
        redis.incr(`usersCount`);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  hGetUser: name => {
    return new Promise((resolve, reject) => {
      try {
        redis.hgetall(`user:${name}`, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  },
  hDelUser: key => {
    redis.del(`user:${key.toLowerCase()}`);
    redis.decr(`usersCount`);
  },
  deleteFromRedis: name => {
    redis.del(name);
  },
  clientDecrypt: string => {
    var decipher = crypto.createDecipher("aes-256-ctr", "3BLqrRGAej");
    var dec = decipher.update(string, "hex", "utf8");
    dec += decipher.final("utf8");
    return dec;
  },
  userSecurity: (clientIP, name) => {
    return new Promise((resolve, reject) => {
      try {
        redis.hgetall(`user:${name}`, (error, result) => {
          if (error) {
            reject(error);
          } else {
            if (Object.keys(result).length === 0) {
              reject("false");
            } else {
              const { identity, user_display_name } = result;
              if (identity === clientIP) {
                resolve(result);
              } else {
                reject(
                  // '${identity}'
                  // ${user_display_name}.
                  `Somebody logged-in your account from another machine, And this session will be cleared. Please re-enter your password to login.`
                );
              }
            }
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  },
  setUserPreferences: (name, options) => {
    return new Promise((resolve, reject) => {
      try {
        redis.hmset(`userPreferences:${name}`, options);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  getUserPreferences: name => {
    return new Promise((resolve, reject) => {
      try {
        redis.hgetall(`userPreferences:${name}`, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  },

};
