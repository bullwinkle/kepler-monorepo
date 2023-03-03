import * as crypto from "crypto";
import { Injectable, MessageEvent } from "@nestjs/common";
import { BehaviorSubject, filter, Observable } from "rxjs";
import { Session as SessionStorage } from "express-session";
import { SSEType } from "@kepler-monorepo/data";


export interface ClientMessagePayload {
  sessionId: "all" | string,

  [key: string]: any
}

export type ClientMessageParams = Partial<Pick<ClientMessage, "type" | "retry">> & ClientMessagePayload;

export class ClientMessage implements MessageEvent {
  id: string = crypto.randomUUID();
  type: SSEType = SSEType.MESSAGE;
  data: ClientMessagePayload;
  retry: number;

  constructor({ type, retry, ...data }: Partial<Pick<ClientMessage, "type" | "retry">> & ClientMessagePayload) {
    this.type = type ?? this.type;
    this.retry = retry;
    this.data = data;
  }
}

@Injectable()
export class AppSSEService {
  readonly #messageEventSubject: BehaviorSubject<ClientMessage> = new BehaviorSubject<ClientMessage>(
    new ClientMessage({ initial: true, sessionId: "all" })
  );

  createSource(session: SessionStorage): Observable<MessageEvent> {
    return this.#messageEventSubject.pipe(filter((message) =>
      ["all"].includes(message.data.sessionId) ||
      (message.data.sessionId === session.id)
    ));
  }

  sendMessage(params: ClientMessageParams) {
    this.#messageEventSubject.next(new ClientMessage(params));
  }
}
