// src/common/middleware/request-id.middleware.ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";
import { ClsService } from "../cls/cls.service";

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  constructor(private readonly clsService: ClsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = (req.headers["x-request-id"] as string) || randomUUID();

    // Gắn vào Response Header
    res.setHeader("X-Request-ID", requestId);

    const initialStore = {
      requestId,
    };

    this.clsService.run(initialStore, () => {
      next();
    });
  }
}
