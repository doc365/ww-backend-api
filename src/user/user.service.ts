import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User } from '@prisma/client';

interface CreateUserDto {
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  createUser(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }
}
