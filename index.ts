import 'reflect-metadata';
import 'module-alias/register';

import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { buildSchema } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { graphqlUploadExpress } from 'graphql-upload';

import express from 'express';
import depthLimit from 'graphql-depth-limit';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import { authChecker, authCheckerSubscription } from './app/middleware/auth';
import { TypegooseMiddleware } from './app/middleware/typegoose';
import { ObjectIdScalar } from './app/libs/object-id.scalar';

import config from './app/config';
import './app/libs/db';

/**
 * Initialize Express
 */
(async () => { // eslint-disable-line @typescript-eslint/no-floating-promises

  /**
   * Creating an express application
   */
  const app = express();

  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb', }));

  app.use(graphqlUploadExpress());

  const schema = await buildSchema({
    resolvers: [`${__dirname}/app/src/**/resolver/resolver.js`], // adding all resolvers
    authChecker,
    globalMiddlewares: [TypegooseMiddleware],
    scalarsMap: [
      { type: ObjectId, scalar: ObjectIdScalar },
    ],
  });

  const server = new ApolloServer({
    schema,
    uploads:false,
    tracing: true,
    cacheControl: true,
    validationRules: [depthLimit(7)],
    introspection: true,
    context: ({ req, connection }) => {
      if (connection) {
        return connection.context;
      }
      return ({ req });

    },
    subscriptions: {
      onConnect: async (connectionParams) => {

        // authorization for subscription
        const verified = await authCheckerSubscription(connectionParams); //eslint-disable-line

        return { authorized: verified };
      },
    },
  });


  /**
   * Middlerware for using CORS
   */
  app.use(cors({
    origin(origin: any, callback: any) { // eslint-disable-line prefer-arrow/prefer-arrow-functions

      /**
       * Allow requests with no origin
       * Like mobile apps or curl requests
       */
      if (!origin) { return callback(null, true); }

      let isAllowed = false;

      config.allowedOrigins.forEach(allowedOrigin => {
        if (allowedOrigin.match(origin) || origin.match(allowedOrigin)) //eslint-disable-line
          {isAllowed = true;}
      });

      if (!isAllowed) {
        const msg = `The CORS policy for this site does not
          allow access from the specified Origin. ${origin}`;
        return callback(new Error(msg), false);
      }

      return callback(null, true);

    },
  }));

  app.use((
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    if (req.originalUrl === '/stripe-connected-webhook') {
      next();
    } else {
      express.json()(req, res, next);
    }
  });

  app.use(compression());
  app.use(morgan('dev'));
  app.use(helmet({ contentSecurityPolicy: (config.environment === 'production') ? undefined : false }));

  server.applyMiddleware({ app });

  /**
   * Listen to port
   */
  const httpServer = createServer(app);

  /**
   * Installing subscription handlers
   */
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen(
    {
      port: config.port,
      host: '0.0.0.0',
    },
    (): void => {
      console.log(`\n🚀 Server running at ${config.port}`);
      console.log(
        `🚀 Server ready at http://localhost:${config.port}${server.graphqlPath}`,
      );
      console.log(
        `🚀 Subscriptions ready at ws://localhost:${config.port}${server.subscriptionsPath}`,
      );
    });
})();
