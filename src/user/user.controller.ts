import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDTO } from './DTO/register-user.dto';
import { LoginUserDTO } from './DTO/login-user.dto';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('register')
  async register(@Body() registerUser: RegisterUserDTO) {
    delete registerUser.captcha;
    return await this.userService.create(registerUser);
  }

  @Post('login')
  async login(@Body() loginUser: LoginUserDTO) {
    const user = await this.userService.login(loginUser);
    return {
      user,
      token: this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
        },
        {
          expiresIn: '7d',
        },
      ),
    };
  }

  @Get('friendship')
  @RequireLogin()
  async friendship(@UserInfo('userId') userId: number) {
    // async friendship(@UserInfo() userInfo) {
    console.log(userId);
    return await this.userService.getFriendship(userId);
  }
}
