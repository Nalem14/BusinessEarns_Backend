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
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: number | string, withPrivate: boolean = false, withSecret : boolean = false): Promise<User> {
    let it = null;

    if(withPrivate)
      it = this.userModel.scope("private");
    if(withSecret)
      it = this.userModel.scope("secret");

    if(!withPrivate && !withSecret)
      it = this.userModel;

    if (Number.isInteger(id))
      return it.findByPk(id);

    return it.findOne({
      where: {
        email: id
      }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.email = updateUserDto.email;
    await user.save();

    return user;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    return user.destroy();
  }
}
