import { IsEnum, IsString } from 'class-validator';
import { UserEntity } from '../entity/user.entity';
import { Roles } from 'src/auth/auth/dto/enum';

export class UserDto implements Readonly<UserDto> {
  id: string;

  @IsString()
  email: string;

  userId: string;

  @IsEnum(Roles)
  role: Roles;

  @IsString()
  password: string;

  public static from(dto: Partial<UserDto>) {
    const it = new UserDto();
    it.id = dto.id;
    it.email = dto.email;
    return it;
  }

  public static fromEntity(entity: UserEntity) {
    return this.from({
      id: entity.id,
      email: entity.email,
      userId: entity.userId,
    });
  }

  public toEntity(user: UserDto = null) {
    const it = new UserEntity();
    it.id = user.id;
    it.email = user.email;
    it.userId = user.userId;
    it.createDateTime = new Date();
    it.createdBy = user.userId;
    it.lastChangedBy = user.userId;
    return it;
  }
}
