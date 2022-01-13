import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiHideProperty, ApiMovedPermanentlyResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Guest } from './auth/guest.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Guest()
  @Get()
  @ApiHideProperty()
  @ApiMovedPermanentlyResponse()
  @Redirect("/api")
  home(): void { }
}
