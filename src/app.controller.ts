import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiMovedPermanentlyResponse, ApiProperty } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Guest } from './auth/guest.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Guest()
  @Get()
  @ApiMovedPermanentlyResponse({ description: "Redirect to /api" })
  @Redirect("/api")
  home(): void { }
}
