import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(email: string): Promise<User> {
    return (await this.userModel.findOne({ email }).exec()) as User;
  }

  async createUser(user: User): Promise<User> {
    const existingUserWIthEmail = await this.userModel.findOne({
      email: user.email,
    });
    if (existingUserWIthEmail) {
      throw new Error('User already exists');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const newUser = new this.userModel({
      name: user.name,
      password: hashedPassword,
      email: user.email,
      createdAt: new Date(),
    });
    return newUser.save();
  }
}
