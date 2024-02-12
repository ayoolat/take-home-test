import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import * as admin from 'firebase-admin';
import { firebaseConfig } from './auth/firebase/firebase';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [UserModule],
  providers: [
    {
      provide: 'FirebaseAdmin',
      useFactory: () => {
        const app = admin.initializeApp({
          credential: admin.credential.cert(firebaseConfig),
          databaseURL: 'https://thecakeshop-fe7a3.firebaseio.com',
        });
        return app;
      },
    },
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
