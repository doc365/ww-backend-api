import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

interface CreateUserDto {
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  create(data: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: 'USER',
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }
}
