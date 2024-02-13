import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CompanyEntity } from '../entity/company.entity';
import { Roles } from 'src/auth/auth/dto/enum';

export class ViewCompanyDto implements Readonly<ViewCompanyDto> {
  @IsString()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  usersCount: number;

  @ApiProperty({ required: true })
  @IsString()
  productsCount: number;

  @ApiProperty({ required: true })
  @IsString()
  image: string;

  @ApiProperty({ required: true })
  @IsString()
  percentage: number;

  public static from(dto: Partial<ViewCompanyDto>) {
    const it = new ViewCompanyDto();
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

  public toEntity(user: string = null) {
    const it = new CompanyEntity();
    it.id = this.id;
    it.name = this.name;
    it.usersCount = this.usersCount.toString();
    it.productsCount = this.productsCount.toString();
    it.percentage = this.percentage;
    it.createDateTime = new Date();
    it.createdBy = user ? user : null;
    it.lastChangedBy = user ? user : null;
    return it;
  }
}
