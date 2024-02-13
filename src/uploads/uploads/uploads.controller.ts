import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/auth/dto/enum';
import { RoleGuard } from 'src/common/gaurd/gaurd';
import { ResponseService } from 'src/common/response/response.service';

@Controller('uploads')
export class UploadsController {
  @Post()
  @UseGuards(new RoleGuard(Roles.VIEWER))
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 2,
      },
    }),
  )
  public async upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'png',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return ResponseService.printResponse<string>({
      status: 201,
      message: 'Image uploaded successfully',
      data: file.filename,
    });
  }
}
