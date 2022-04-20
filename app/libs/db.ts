import mongoose from 'mongoose';
import Promise from 'bluebird';
import path from 'path';
import fs from 'fs';

import config from 'app/config';

/**
 * Promisify All The Mongoose
 *
 * @param mongoose
 */
Promise.promisifyAll(mongoose);

/**
 * Connecting Mongoose
 *
 * @param uris
 * @param options
 */
const connect = () => mongoose.connect(config.db, {
  bufferMaxEntries: 0,
  keepAlive: true,
  socketTimeoutMS: 0,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}, (error): any => {
  if (error) {
    console.log('error', error);
  }
});

connect(); // eslint-disable-line @typescript-eslint/no-floating-promises

/**
 * Throw error when not able to connect to database
 */
mongoose.connection.on('error', console.log);

/**
 * Disconnect database
 */
mongoose.connection.on('disconnected', connect); // eslint-disable-line @typescript-eslint/no-misused-promises

/**
 * Set debugging for database
 */
mongoose.set('debug', true);

/**
 * Register database schema for mongoose
 */
const registerSchema = () => {
  fs.readdirSync(path.join(__dirname, '../src')).forEach((folder) => {
    const modelFilePath = path.join(__dirname, '../src/', folder, '/model/model');
    if(fs.existsSync(modelFilePath)){
      require(modelFilePath); // eslint-disable-line import/no-dynamic-require,global-require
    }
  });
};

registerSchema();
