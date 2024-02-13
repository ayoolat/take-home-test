import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user/user.service';
import { CompanyDto } from './dto/companyDto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from './entity/company.entity';
import { Repository } from 'typeorm';
import { ResponseService } from 'src/common/response/response.service';
import { PaginatedList } from 'src/common/response/dtos/paginatedList';
import { ViewCompanyDto } from './dto/viewCompanyDto';
import * as fs from 'fs';
import { ResponseDto } from 'src/common/response/dtos/responseDto';
import { logger } from '../../app.logger';
import { NotFoundError } from 'rxjs';
import * as path from 'path';

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

      const percentage =
        Math.round((companyDto.productsCount / companyDto.usersCount) * 100) /
        100;

      const companyEntity = CompanyDto.toEntity(userId, companyDto);
      companyEntity.user = user;
      companyEntity.percentage = percentage;

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

        if (c.image) {
          const basePath = path.join(
            __filename,
            `../../../../uploads/${c.image}`,
          );
          companyDto.image = fs.readFileSync(basePath);
        }
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
      const company = await this.repo.findOneBy({ id });
      const companyDto = ViewCompanyDto.fromEntity(
        await this.repo.findOneBy({ id }),
      );

      if (company.image) {
        const basePath = path.join(
          __filename,
          `../../../../uploads/${company.image}`,
        );
        companyDto.image = fs.readFileSync(basePath);
      }

      return ResponseService.printResponse<ViewCompanyDto>({
        status: 200,
        message: 'Company query successful',
        data: companyDto,
      });
    } catch (error) {
      logger.error(
        `[${new Date().toUTCString()}] :: Error while fetching company :: ${error.message}`,
      );
      throw error;
    }
  }

  public async uploadImage(fileName: string, companyId: string) {
    try {
      const company = await this.repo.findOneBy({ id: companyId });
      if (!company) throw new NotFoundException('Company not found');
      console.log(company);
      company.image = fileName;
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
