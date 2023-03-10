import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOne(email);
    if (user) {
      const userPass = user.password;

      if (await bcrypt.compare(password, userPass)) {
        const { password, ...result } = user;
        return result as User;
      }
      throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
    }
    throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
  }
  async login(user: any) {
    const payload = {
      name: user._doc.name,
      sub: user._doc._id,
      email: user._doc.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  // async validateNewUser(newUser: User): Promise<User> {
  //   const user = await this.usersService.createUser(newUser);
  //   const existingUser = await this.usersService.findOne(newUser.username);

  //   if (existingUser) {
  //     console.log('existingUser', existingUser);
  //     throw new Error('User already exists');
  //   }
  //   const { password, ...result } = user;
  //   return result as User;
  // }
}
