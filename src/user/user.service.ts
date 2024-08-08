import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDTO } from './DTO/login-user.dto';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prisma: PrismaService;

  async create(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({
      data,
      select: {
        id: true,
      },
    });
  }

  async login(loginUserDTO: LoginUserDTO) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        username: loginUserDTO.username,
      },
    });

    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (foundUser.password !== loginUserDTO.password) {
      throw new HttpException('用户名或密码不正确', HttpStatus.BAD_REQUEST);
    }

    delete foundUser.password;
    return foundUser;
  }
}
