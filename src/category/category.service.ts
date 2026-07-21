import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, createDto: CreateCategoryDto) {
    return this.prisma.category.create({ data: { ...createDto, userId } });
  }

  findAll(userId: string) {
    return this.prisma.category.findMany({ where: { userId } });
  }

  findOne(id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  update(id: string, updateDto: UpdateCategoryDto) {
    return this.prisma.category.update({ where: { id }, data: updateDto });
  }

  remove(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
