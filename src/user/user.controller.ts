import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  // Any authenticated user can view all users
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // Any authenticated user can view their own profile
  @Get('me')
  getProfile(@GetUser() user: JwtPayload) {
    return this.userService.findById(user.userId);
  }

  // Only admins can delete users
  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  // Only admins and moderators can view user by ID
  @Get(':id')
  @Roles(Role.ADMIN, Role.MODERATOR)
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
