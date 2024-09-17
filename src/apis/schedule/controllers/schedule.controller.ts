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
  ParseUUIDPipe,
} from '@nestjs/common';
import { IScheduleService, ScheduleService } from '../services';
import { CreateScheduleDto } from '../dtos/input';
import { Schedule } from '../entities';

@Controller('schedule')
export class ScheduleController {
  constructor(
    @Inject(ScheduleService)
    private readonly _scheduleService: IScheduleService,
  ) {}

  @Post()
  async create(@Body() schedule: CreateScheduleDto): Promise<string> {
    return await this._scheduleService.create(schedule);
  }

  @Put(':id/start')
  async startSchedule(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<boolean> {
    return await this._scheduleService.startSchedule(id);
  }

  @Put(':id/stop')
  async stopSchedule(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
    return await this._scheduleService.stopSchedule(id);
  }

  @Get()
  async findAll(): Promise<Schedule[]> {
    return await this._scheduleService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id', ParseUUIDPipe) id: string): Promise<Schedule> {
    return await this._scheduleService.findOneById(id);
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
