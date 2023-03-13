/* eslint-disable no-console */
require('dotenv').config();
const { readFile } = require('fs/promises');
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware: apolloExpress } = require('@apollo/server/express4');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

const resolvers = require('./graphql/resolvers');
const RouteNotFound = require('./errors/routeNotFound');
const errorMiddleware = require('./middlewares/error');

require('./db/connection');

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.typeDefs = ``;
    this.resolvers = resolvers;
    this.schema = null;
    this.apolloServer = null;
    this.middleware();
  }

  async middleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false, limit: '50mb' }));
    // security
    this.app.use(helmet());
    this.app.use(xss());
    this.app.use(mongoSanitize());
    this.app.use(hpp());
    this.app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
      }),
    );
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }
    this.typeDefs = await readFile('./src/graphql/index.graphql', 'utf8');
    this.schema = makeExecutableSchema({
      typeDefs: this.typeDefs,
      resolvers: this.resolvers,
    });
    this.apolloServer = new ApolloServer({
      resolvers: this.resolvers,
      typeDefs: this.typeDefs,
    });
    await this.apolloServer.start();
    console.log('1. Apollo Server started');
    this.app.use('/graphql', apolloExpress(this.apolloServer));

    this.app.use((req, res, next) => next(new RouteNotFound()));

    this.app.use(errorMiddleware);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.info(`[Server]: Running at http://localhost:${this.port}...`);
      console.log(`GraphQL endpoint: http://localhost:${this.port}/graphql`);
    });
  }
}

if (module === require.main) {
  console.log('2. Starting server...');
  new App().listen();
  console.log('3. Server started');
}

module.exports = new App().app;
