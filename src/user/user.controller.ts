import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDTO } from './DTO/register-user.dto';
import { LoginUserDTO } from './DTO/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUser: RegisterUserDTO) {
    delete registerUser.captcha;
    return await this.userService.create(registerUser);
  }

  @Post('login')
  async login(@Body() loginUser: LoginUserDTO) {
    return await this.userService.login(loginUser);
  }
}
