import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [CommentController],
  providers: [CommentService, PrismaService],
})
export class CommentModule {}
