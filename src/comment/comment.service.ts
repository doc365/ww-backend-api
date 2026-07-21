import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, createDto: CreateCommentDto) {
    return this.prisma.comment.create({ data: { ...createDto, userId } });
  }

  findAll(userId: string) {
    return this.prisma.comment.findMany({ where: { userId } });
  }

  findOne(id: string) {
    return this.prisma.comment.findUnique({ where: { id } });
  }

  update(id: string, updateDto: UpdateCommentDto) {
    return this.prisma.comment.update({ where: { id }, data: updateDto });
  }

  remove(id: string) {
    return this.prisma.comment.delete({ where: { id } });
  }
}
