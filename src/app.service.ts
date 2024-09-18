import {
  Controller,
  Get,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { IScheduleService, ScheduleService } from './apis/schedule/services';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject(ScheduleService)
    private readonly _scheduleService: IScheduleService,
  ) {}

  onModuleInit() {
    this._scheduleService.startBulkSchedule();
  }
}
