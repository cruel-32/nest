import { Controller, Request, Get, Post, Body } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('appTest')
  createProfile(@Body() createDto: { testMessage: string }) {
    console.log('createDto : ', createDto);

    return null;
  }
}
