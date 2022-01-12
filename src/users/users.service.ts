import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto) : Promise<User> {
    return this.userModel.create(createUserDto);
  }
  
  async findAll() : Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: number) : Promise<User> {
    return this.userModel.findByPk(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) : Promise<User> {
    const user = await this.findOne(id);
    return user.update({ updateUserDto });
  }

  async remove(id: number) : Promise<void> {
    const user = await this.findOne(id);
    return user.destroy();
  }
}
