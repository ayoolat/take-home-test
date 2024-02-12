import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CompanyEntity } from '../entity/company.entity';
import { Roles } from 'src/auth/auth/dto/enum';

export class CompanyDto implements Readonly<CompanyDto> {
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsNumber()
  usersCount: number;

  @ApiProperty({ required: true })
  @IsNumber()
  productsCount: number;

  percentage: number;

  public static from(dto: Partial<CompanyDto>) {
    const it = new CompanyDto();
    it.id = dto.id;
    it.name = dto.name;
    it.usersCount = dto.usersCount;
    it.productsCount = dto.productsCount;
    it.percentage = dto.percentage;
    return it;
  }

  public static fromEntity(entity: CompanyEntity) {
    return this.from({
      id: entity.id,
      name: entity.name,
      usersCount: parseInt(entity.usersCount),
      productsCount: parseInt(entity.productsCount),
      percentage: entity.percentage,
    });
  }

  public static toEntity(user: string = null, company: CompanyDto) {
    console.log(user);
    const it = new CompanyEntity();
    it.id = company.id;
    it.name = company.name;
    it.usersCount = company.usersCount.toString();
    it.productsCount = company.productsCount.toString();
    it.percentage = company.percentage;
    it.createDateTime = new Date();
    it.createdBy = user ? user : null;
    it.lastChangedBy = user ? user : null;
    return it;
  }
}
