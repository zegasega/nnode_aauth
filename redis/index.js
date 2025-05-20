const { createClient } = require('redis');

class RedisClient {
  constructor() {
    this.client = createClient({
      url: 'redis://127.0.0.1:6379'
    });

    this._setupEvents();
  }

  _setupEvents() {
    this.client.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    this.client.on('connect', async () => {
      console.log('Redis connected');
      try {
        await this.client.flushAll(); 
        console.log('Redis cache cleared on server restart');
      } catch (error) {
        console.error('Error clearing Redis cache:', error);
      }
    });
  }

  async connect() {
    await this.client.connect();
  }

  getClient() {
    return this.client;
  }
}

module.exports = new RedisClient();
