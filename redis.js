const redis = require("redis");

const client = redis.createClient(process.env.DEPLOYMENT==="local" ? {} :{ url: 'redis://redis:6379' });

module.exports = { client };
