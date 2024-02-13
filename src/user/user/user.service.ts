import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { UserDto } from './user/userDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly repo: Repository<UserEntity>,
  ) {}

  public async createUser(user: UserDto) {
    await this.repo.create(new UserDto().toEntity(user));
    return user;
  }

  public async getUser(userId: string): Promise<UserEntity> {
    const user = await this.repo.findOneBy({ userId: userId });
    return user;
  }
}
