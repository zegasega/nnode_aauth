const { createClient } = require('redis');

const redisClient = createClient({
  url: 'redis://127.0.0.1:6379'
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.on('connect', async () => {
  console.log('Redis connected');
  try {
    await redisClient.flushAll();
    console.log('✅ Redis cache cleared on server restart');
  } catch (error) {
    console.error('❌ Error clearing Redis cache:', error);
  }
});

redisClient.connect();

module.exports = redisClient;
