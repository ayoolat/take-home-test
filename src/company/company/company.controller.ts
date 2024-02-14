import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CompanyDto } from './dto/companyDto';
import { ResponseDto } from 'src/common/response/dtos/responseDto';
import { PaginatedList } from 'src/common/response/dtos/paginatedList';
import { ViewCompanyDto } from './dto/viewCompanyDto';
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
    return this.companiesService.createCompany(companyDto, req['user'].userId);
  }

  @Get('list/all')
  async getCompanies(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<ResponseDto<PaginatedList<ViewCompanyDto[]>>> {
    return await this.companiesService.getCompanies(page, pageSize);
  }

  @Get('/list')
  async getUserCompanies(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Req() req: Request,
  ): Promise<ResponseDto<PaginatedList<ViewCompanyDto[]>>> {
    return await this.companiesService.getUserCompanies(
      page,
      pageSize,
      req['user'].userId,
    );
  }

  @Get(':companyId')
  async getOne(
    @Param('companyId') companyId: string,
  ): Promise<ResponseDto<ViewCompanyDto>> {
    return await this.companiesService.getCompany(companyId);
  }

  @Put('/:companyId')
  @UseGuards(new RoleGuard(Roles.VIEWER))
  async addImage(
    @Param('companyId') companyId: string,
    @Body('fileName') fileName: string,
  ): Promise<ResponseDto<CompanyDto>> {
    return await this.companiesService.uploadImage(fileName, companyId);
  }
}
