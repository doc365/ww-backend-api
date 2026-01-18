import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.login(email, password);
  }

  @Post('register')
  register(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.register(email, password);
  }

  @Get('me')
  me() {
    return {
      message: 'JWT guard disabled',
      note: 'Enable AuthGuard(jwt) later',
    };
  }
}
