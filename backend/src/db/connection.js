const mongoose = require('mongoose');

const config = require('../config');

class Database {
  db;

  url = config.mongo_url;

  constructor() {
    this.params = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 2000000,
      keepAlive: true,
    };
  }

  async connect() {
    try {
      this.db = await mongoose.connect(this.url, this.params);

      // eslint-disable-next-line no-console
      console.info(`[Database]: MongoDB connected: ${await this.db.connection.host}`);

      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`[Error]: connecting to database:`, error);
      return process.exit(1);
    }
  }
}

const db = new Database();

if (process.env.NODE_ENV !== 'test') db.connect();

module.exports = db;
