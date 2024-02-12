import { Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user/user.service';
import { UserDto } from 'src/user/user/user/userDto';
import * as admin from 'firebase-admin';
import {
  UserCredential,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import * as firebase from 'firebase/app';
import { LoginDto } from './dto/loginDto';
import { ResponseService } from 'src/common/response/response.service';
import { Roles } from './dto/enum';
import { ResponseDto } from 'src/common/response/dtos/responseDto';
import { firebaseAuthConfig, firebaseConfig } from './firebase/firebase';
import { LoginResponseDto } from './dto/loginResponseDto';
import { logger } from '../../app.logger';

@Injectable()
export class AuthService {
  constructor(
    @Inject('FirebaseAdmin') private readonly firebaseAdmin: admin.app.App,
    private readonly usersService: UserService,
  ) {
    if (!firebase.getApps.length) {
      firebase.initializeApp(firebaseAuthConfig);
    }
  }

  public async registerUser(user: UserDto): Promise<ResponseDto<UserDto>> {
    try {
      const userRecord = await this.firebaseAdmin.auth().createUser({
        email: user.email,
        password: user.password,
      });
      user.userId = userRecord.uid;

      switch (user.role) {
        case Roles.INPUTER:
          await this.firebaseAdmin.auth().setCustomUserClaims(userRecord.uid, {
            role: Roles.INPUTER,
          });
          break;
        case Roles.VIEWER:
          await this.firebaseAdmin.auth().setCustomUserClaims(userRecord.uid, {
            role: Roles.VIEWER,
          });
          break;
        default:
          await this.firebaseAdmin.auth().setCustomUserClaims(userRecord.uid, {
            role: Roles.INPUTER,
          });
          break;
      }

      const userEntity = await this.usersService.createUser(user);
      return ResponseService.printResponse<UserDto>({
        status: 201,
        message: 'Registration successful',
        data: userEntity,
      });
    } catch (error) {
      logger.error(
        `[${new Date().toUTCString()}] :: Error while registering user :: ${error.message}`,
      );
      throw error;
    }
  }

  public async login(login: LoginDto): Promise<ResponseDto<LoginResponseDto>> {
    try {
      const auth = await getAuth();
      const token = await signInWithEmailAndPassword(
        auth,
        login.email,
        login.password,
      );
      return ResponseService.printResponse<LoginResponseDto>({
        status: 200,
        message: 'Login successful',
        data: {
          email: token.user.email,
          uid: token.user.uid,
          emailVerified: token.user.emailVerified,
          refreshToken: token.user.refreshToken,
          accessToken: await token.user.getIdToken(),
        },
      });
    } catch (error) {
      logger.error(
        `[${new Date().toUTCString()}] :: Error while logging user in :: ${error.message}`,
      );
      throw error;
    }
  }
}
