import {
  Controller,
  Request,
  Body,
  Post,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './auth/dto/create-user.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req: any) {
    console.log(req, 'req body');
    return this.authService.login(req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Post('auth/signup')
  async signUp(@Request() req: any, @Body() createUserDto: CreateUserDto) {
    console.log(createUserDto, 'createUserDto');
    return this.userService.createUser(createUserDto);
  }
}
