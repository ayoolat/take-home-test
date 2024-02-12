import { Module } from '@nestjs/common';
import { CompanyService } from './company/company.service';
import { CompanyController } from './company/company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from './company/entity/company.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity]), UserModule],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
