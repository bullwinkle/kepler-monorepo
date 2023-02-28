import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { API_PATH_PREFIX } from "@kepler-monorepo/configuration";
import session from "express-session";

import { AppModule } from "./app/app.module";

dotenv.config();

async function bootstrap() {
  const port = process.env.PORT || 3333;
  const app = await NestFactory.create(AppModule, { cors: true });
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

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${API_PATH_PREFIX}`);
}

bootstrap();
