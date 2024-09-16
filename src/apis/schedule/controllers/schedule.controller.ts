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
  Inject,
} from '@nestjs/common';
import { IScheduleService, ScheduleService } from '../services';
import { CreateScheduleDto } from '../dtos/input';

@Controller('schedule')
export class ScheduleController {
  constructor(
    @Inject(ScheduleService)
    private readonly _scheduleService: IScheduleService,
  ) {}

  @Post()
  async create(@Body() schedule: CreateScheduleDto): Promise<boolean> {
    return await this._scheduleService.create(schedule);
  }

  // @Post()
  // createCron(@Body('name') name: string) {
  //   return this._scheduleService.createCron(name);
  // }

  // @Put(':name/stop')
  // stopCron(@Param('name') name: string) {
  //   return this.scheduleService.stopCron(name);
  // }

  // @Put(':name/start')
  // startCron(@Param('name') name: string) {
  //   return this.scheduleService.startCron(name);
  // }
}
