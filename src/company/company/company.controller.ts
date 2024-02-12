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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CompanyDto } from './dto/companyDto';
import { ResponseDto } from 'src/common/response/dtos/responseDto';
import { PaginatedList } from 'src/common/response/dtos/paginatedList';
import { ViewCompanyDto } from './dto/viewCompanyDto';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { RoleGuard } from 'src/common/gaurd/gaurd';
import { Roles } from 'src/auth/auth/dto/enum';

@ApiBearerAuth()
@Controller('company')
export class CompanyController {
  constructor(private readonly companiesService: CompanyService) {}

  @Post('create')
  @UseGuards(new RoleGuard(Roles.INPUTER))
  async create(
    @Body() companyDto: CompanyDto,
    @Req() req: Request,
  ): Promise<ResponseDto<CompanyDto>> {
    const response = this.companiesService.createCompany(
      companyDto,
      req['user'].userId,
    );
    return response;
  }

  @Get('list')
  async get(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<ResponseDto<PaginatedList<ViewCompanyDto[]>>> {
    return await this.companiesService.getCompanies(page, pageSize);
  }

  @Put('/:companyId')
  @UseGuards(new RoleGuard(Roles.VIEWER))
  @UseInterceptors(AnyFilesInterceptor())
  async addImage(
    @UploadedFile()
    file: Express.Multer.File,
    @Param('companyId') companyId: string,
  ): Promise<ResponseDto<CompanyDto>> {
    return await this.companiesService.uploadImage(file.filename, companyId);
  }
}
