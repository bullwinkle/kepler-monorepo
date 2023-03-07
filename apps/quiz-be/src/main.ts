import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { API_PATH_PREFIX } from "@kepler-monorepo/configuration";
import session from "express-session";

import {ExpressAdapter, NestExpressApplication} from '@nestjs/platform-express';
import express from 'express';
import * as functions from 'firebase-functions';

import { AppModule } from "./app/app.module";

dotenv.config();

const expressServer: express.Express = express();

async function bootstrap() {
  const port = process.env.PORT || 3333;
  const adapter = new ExpressAdapter(expressServer);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, adapter,{ cors: true });
  app.setGlobalPrefix(API_PATH_PREFIX);

  app.use(session({
    secret: process.env.KEPLER_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 30/* minutes */ * 60 * 1000
    }
  }));

  const appServer = await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${API_PATH_PREFIX}`);
  return appServer;
}

bootstrap()
  .then(v => console.log('Nest Ready'))
  .catch(err => console.error('Nest broken', err));

export const api: functions.HttpsFunction = functions.https.onRequest(expressServer);


//
// export const createNestServer = async (expressInstance: express.Express) => {
//   const adapter = new ExpressAdapter(expressInstance);
//   const app = await NestFactory.create<NestExpressApplication>(
//     AppModule, adapter, {},
//   );
//   app.enableCors();
//   return app.init();
// };
// createNestServer(server)
//   .then(v => console.log('Nest Ready'))
//   .catch(err => console.error('Nest broken', err));
// export const api: functions.HttpsFunction = functions.https.onRequest(server);
