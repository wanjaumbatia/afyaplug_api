import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class VerifiedMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log("check verification");
    next();
  }
}
