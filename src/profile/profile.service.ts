import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, createDto: CreateProfileDto) {
    return this.prisma.profile.create({ data: { ...createDto, userId } });
  }

  findAll(userId: string) {
    return this.prisma.profile.findMany({ where: { userId } });
  }

  findOne(id: string) {
    return this.prisma.profile.findUnique({ where: { id } });
  }

  update(id: string, updateDto: UpdateProfileDto) {
    return this.prisma.profile.update({ where: { id }, data: updateDto });
  }

  remove(id: string) {
    return this.prisma.profile.delete({ where: { id } });
  }
}
