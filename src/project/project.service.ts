import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, createDto: CreateProjectDto) {
    return this.prisma.project.create({ data: { ...createDto, userId } });
  }

  findAll(userId: string) {
    return this.prisma.project.findMany({ where: { userId } });
  }

  findOne(id: string) {
    return this.prisma.project.findUnique({ where: { id } });
  }

  update(id: string, updateDto: UpdateProjectDto) {
    return this.prisma.project.update({ where: { id }, data: updateDto });
  }

  remove(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }
}
