import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { Public } from '@/decorators/jwt.decorator';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() req) {
    // console.log('controller : ', req.user);
    return this.authService.login(req.user);
  }
}
