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
      if (!user) {
        throw new NotFoundException('User not found.');
      }

      const averageUsersPerProduct =
        companyDto.usersCount / companyDto.productsCount;
      const companyEntity = CompanyDto.toEntity(userId, companyDto);
      companyEntity.percentage = parseFloat(
        ((averageUsersPerProduct / companyDto.usersCount) * 100).toFixed(2),
      );
      companyEntity.user = user;

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

  public async getUserCompanies(
    page: number,
    pageSize: number,
    userId: string,
  ): Promise<ResponseDto<PaginatedList<ViewCompanyDto[]>>> {
    try {
      const user = await this.usersService.getUser(userId);
      if (!user) {
        throw new NotFoundException('User not found.');
      }
      const companies = (
        await this.repo.find({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: { userId: user.id },
          order: { id: 'DESC' },
        })
      ).map((c) => {
        const companyDto = ViewCompanyDto.fromEntity(c);

        if (c.image) {
          const basePath = path.join(
            __filename,
            `../../../../uploads/${c.image}`,
          );
          this.handleImage(companyDto, basePath);
        }
        return companyDto;
      });
      return ResponseService.printResponse<PaginatedList<ViewCompanyDto[]>>({
        status: 200,
        message: 'Company query successful',
        data: {
          page,
          pageSize,
          totalCount: await this.repo.count({ where: { userId: user.id } }),
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

  public async getCompanies(
    page: number,
    pageSize: number,
  ): Promise<ResponseDto<PaginatedList<ViewCompanyDto[]>>> {
    try {
      const companies = (
        await this.repo.find({
          skip: (page - 1) * pageSize,
          take: pageSize,
          order: { id: 'DESC' },
        })
      ).map((c) => {
        const companyDto = ViewCompanyDto.fromEntity(c);

        if (c.image) {
          const basePath = path.join(
            __filename,
            `../../../../uploads/${c.image}`,
          );
          this.handleImage(companyDto, basePath);
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
      if (!company) {
        throw new NotFoundException('Company not found');
      }
      const companyDto = ViewCompanyDto.fromEntity(
        await this.repo.findOneBy({ id }),
      );

      if (company.image) {
        const basePath = path.join(
          __filename,
          `../../../../uploads/${company.image}`,
        );
        this.handleImage(companyDto, basePath);
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
      if (!company) {
        throw new NotFoundException('Company not found');
      }

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
  private handleImage(companyDto: ViewCompanyDto, basePath: string) {
    try {
      companyDto.image = `data:png;base64,${fs.readFileSync(basePath).toString('base64')}`;
    } catch (error) {
      logger.error(error.message);
      companyDto.image = '';
    }
  }
}
