import { join } from "path";
import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { FRONT_END_APP } from "@kepler-monorepo/configuration";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongooseModule } from "@nestjs/mongoose";


import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AppSSEService } from "./app-sse.service";
import { QuizModule } from "./quiz/quiz.module";
import { ResultsModule } from "./results/results.module";
import { QuestionsModule } from "./questions/questions.module";
// Schema.Types.ObjectId.get(v => v.toString());

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", FRONT_END_APP)
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const memoryServer = new MongoMemoryServer();
        await memoryServer.start(true);
        return {
          uri: memoryServer.getUri(),
          // useNewUrlParser: true,
          // useUnifiedTopology: true
        };
      }
    }),
    QuizModule,
    ResultsModule,
    QuestionsModule
  ],
  controllers: [AppController],
  providers: [AppService, AppSSEService]
})
export class AppModule {
}
