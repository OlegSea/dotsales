import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Lead } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("/api/leads")
  async leads(@Query() query): Promise<Lead[]> {
    return await this.appService.leads(query);
  }
}
