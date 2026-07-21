import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('task')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@GetUser() user: JwtPayload, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(user.userId, createTaskDto);
  }

  @Get()
  findAll(@GetUser() user: JwtPayload) {
    return this.taskService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@GetUser() user: JwtPayload, @Param('id') id: string) {
    return this.taskService.findOne(user.userId, id);
  }

  @Patch(':id')
  update(
    @GetUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(user.userId, id, updateTaskDto);
  }

  @Delete(':id')
  remove(@GetUser() user: JwtPayload, @Param('id') id: string) {
    return this.taskService.remove(user.userId, id);
  }
}
