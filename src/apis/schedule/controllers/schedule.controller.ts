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
  ParseBoolPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { IScheduleService, ScheduleService } from '../services';
import {
  CreateScheduleDto,
  SchedulePaginationDto,
  UpdateScheduleDto,
} from '../dtos/input';
import { Schedule } from '../entities';
import { PaginationOutDto } from 'src/core/dtos';
import { ScheduleCronJobDto } from '../dtos/output';

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

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() schedule: UpdateScheduleDto,
  ): Promise<boolean> {
    return await this._scheduleService.update(id, schedule);
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

  @Put('start-all-active')
  async startBulkSchedule(): Promise<void> {
    await this._scheduleService.startBulkSchedule();
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
    return await this._scheduleService.delete(id);
  }

  @Get()
  async findAll(): Promise<Schedule[]> {
    return await this._scheduleService.findAll();
  }

  @Get('paginated')
  async findPaginated(
    @Query() paginationDto: SchedulePaginationDto,
  ): Promise<PaginationOutDto<ScheduleCronJobDto>> {
    return await this._scheduleService.findPaginated(paginationDto);
  }

  @Get(':id')
  async findOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ScheduleCronJobDto> {
    return await this._scheduleService.findOneById(id);
  }
}
