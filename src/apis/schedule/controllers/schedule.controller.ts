import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { ScheduleService } from '../services/schedule.service';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto/input';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  createCron(@Body('name') name: string) {
    return this.scheduleService.createCron(name);
  }

  @Put(':name/stop')
  stopCron(@Param('name') name: string) {
    return this.scheduleService.stopCron(name);
  }

  @Put(':name/start')
  startCron(@Param('name') name: string) {
    return this.scheduleService.startCron(name);
  }
}
