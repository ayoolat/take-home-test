import { Injectable } from '@nestjs/common';
import { ResponseDto } from './dtos/responseDto';

@Injectable()
export class ResponseService {
  public static printResponse<T>(response: ResponseDto<T>): ResponseDto<T> {
    return {
      status: response.status,
      message: response.message,
      data: response.data,
    };
  }
}
