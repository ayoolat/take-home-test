import * as firebase from 'firebase-admin';
import {
  Inject,
  Injectable,
  NestMiddleware,
  Next,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import * as admin from 'firebase-admin';
import { firebaseConfig } from '../firebase';

@Injectable()
export class PreAuthMiddleware implements NestMiddleware {
  private defaultApp: firebase.app.App;

  constructor() {
    if (!firebase.apps.length) {
      this.defaultApp = firebase.initializeApp({
        credential: firebase.credential.cert(firebaseConfig),
        databaseURL: 'https://thecakeshop-fe7a3.firebaseio.com',
      });
    } else {
      this.defaultApp = firebase.app();
    }
  }

  use(req: Request, res: Response, next: Function) {
    const token = req.headers.authorization;
    if (token && token != '') {
      this.defaultApp
        .auth()
        .verifyIdToken(token.replace('Bearer ', ''))
        .then(async (decodeToken) => {
          req['user'] = { userId: decodeToken.sub, role: decodeToken.role };
          next();
        })
        .catch((error) => {
          this.accessDenied(req.url, res);
        });
    } else {
      throw new UnauthorizedException();
    }
  }

  private accessDenied(url: string, res: Response) {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'Access Denied',
    });
  }
}
