import * as crypto from "crypto";
import { Controller, Get, MessageEvent, Req, Session, Sse } from "@nestjs/common";
import { Request } from "express";
import { Session as SessionStorage } from "express-session";
import { from, interval, mergeMap, Observable, switchMap } from "rxjs";
import { SSEType } from "@kepler-monorepo/data";

import { AppService } from "./app.service";
import { AppSSEService } from "./app-sse.service";


@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private appSseService: AppSSEService) {
  }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get("session")
  getSession(@Req() request: Request) {
    this.appSseService.sendMessage({ sessionId: request.session.id, session: request.session });
    return JSON.stringify(request.session);
  }

  @Sse("sse")
  sse(@Session() session: SessionStorage): Observable<MessageEvent> {
    return this.appSseService.createSource(session);
  }

  private async patchSession(session: SessionStorage, patch: { [key: string]: any }) {
    return interval(1000).pipe(
      switchMap(async (i) => {
        try {
          await new Promise((rs, rj) => session.reload((err) => err ? rj(err) : rs("reloaded")));
          console.warn("session reloaded");

          Object.assign(session, patch);

          await new Promise((rs, rj) => session.save((err) => err ? rj(err) : rs("updated")));
          console.warn("session updated");

          session.touch();
          console.warn("session updated");
        } catch (e) {
          console.warn("session update error", e);
        }
      }),
      mergeMap((i) => {
        const data = { hello: "world", i };

        console.warn("session", session);

        return from([
          { id: crypto.randomUUID(), data } as MessageEvent,
          { id: crypto.randomUUID(), data, type: SSEType.NOTICE } as MessageEvent,
          { id: crypto.randomUUID(), data, type: SSEType.UPDATE } as MessageEvent
        ]);
      })
    );
  }
}
