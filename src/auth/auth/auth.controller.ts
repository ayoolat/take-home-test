import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Put,
  UseInterceptors,
  UploadedFile,
  Param,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/user/user/userDto';
import { ResponseDto } from 'src/common/response/dtos/responseDto';
import { UserCredential } from 'firebase/auth';
import { LoginDto } from './dto/loginDto';
import { LoginResponseDto } from './dto/loginResponseDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userDto: UserDto): Promise<ResponseDto<UserDto>> {
    return this.authService.registerUser(userDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<ResponseDto<LoginResponseDto>> {
    return this.authService.login(loginDto);
  }
}
