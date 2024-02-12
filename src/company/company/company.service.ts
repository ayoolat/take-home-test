import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user/user.service';
import { CompanyDto } from './dto/companyDto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from './entity/company.entity';
import { Repository } from 'typeorm';
import { ResponseService } from 'src/common/response/response.service';
import { PaginatedList } from 'src/common/response/dtos/paginatedList';
import { ViewCompanyDto } from './dto/viewCompanyDto';
import fs from 'fs';
import { ResponseDto } from 'src/common/response/dtos/responseDto';
import { logger } from '../../app.logger';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly repo: Repository<CompanyEntity>,
    private readonly usersService: UserService,
  ) {}

  public async createCompany(
    companyDto: CompanyDto,
    userId: string,
  ): Promise<ResponseDto<CompanyDto>> {
    try {
      const user = await this.usersService.getUser(userId);

      const companyEntity = CompanyDto.toEntity(userId, companyDto);
      companyEntity.user = user;
      const productsCount = parseInt(companyEntity.productsCount);
      const usersCount = parseInt(companyEntity.usersCount);

      companyEntity.percentage =
        Math.round((productsCount / usersCount) * 100 * 100) / 100;

      const savedCompanyEntity = await this.repo.save(companyEntity);
      return ResponseService.printResponse<CompanyDto>({
        status: 201,
        message: 'Company creation successful',
        data: CompanyDto.fromEntity(savedCompanyEntity),
      });
    } catch (error) {
      logger.error(
        `[${new Date().toUTCString()}] :: Error while creating company :: ${error.message}`,
      );
      throw error;
    }
  }

  public async getCompanies(
    page: number,
    pageSize: number,
  ): Promise<ResponseDto<PaginatedList<ViewCompanyDto[]>>> {
    try {
      const companies = (
        await this.repo.find({
          skip: (page - 1) * pageSize,
          take: pageSize,
        })
      ).map((c) => {
        const companyDto = ViewCompanyDto.fromEntity(c);
        if (companyDto.image)
          companyDto.image = fs.readFileSync(`../../../uploads/${c.image}`);
        return companyDto;
      });
      return ResponseService.printResponse<PaginatedList<ViewCompanyDto[]>>({
        status: 200,
        message: 'Company query successful',
        data: {
          page,
          pageSize,
          totalCount: await this.repo.count(),
          data: companies,
        },
      });
    } catch (error) {
      logger.error(
        `[${new Date().toUTCString()}] :: Error while fetching companies :: ${error.message}`,
      );
      throw error;
    }
  }

  public async getCompany(id: string) {
    try {
      return ResponseService.printResponse<CompanyDto>({
        status: 200,
        message: 'Company query successful',
        data: CompanyDto.fromEntity(await this.repo.findOneBy({ id })),
      });
    } catch (error) {
      logger.error(
        `[${new Date().toUTCString()}] :: Error while fetching company :: ${error.message}`,
      );
      throw error;
    }
  }

  public async uploadImage(file: string, companyId: string) {
    try {
      const company = await this.repo.findOneBy({ id: companyId });
      company.image = file;
      await this.repo.save(company);
      return ResponseService.printResponse<CompanyDto>({
        status: 200,
        message: 'Company update successful',
        data: CompanyDto.fromEntity(company),
      });
    } catch (error) {
      logger.error(
        `[${new Date().toUTCString()}] :: Error while uploading image :: ${error.message}`,
      );
      throw error;
    }
  }
}
