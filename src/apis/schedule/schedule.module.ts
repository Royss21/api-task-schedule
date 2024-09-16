import { Module } from '@nestjs/common';
import { ScheduleController } from './controllers/schedule.controller';
import { ScheduleService } from './services/schedule.service';
import { RepositoriesModule } from 'src/shared/repositories/repositories.module';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [RepositoriesModule],
})
export class ScheduleTaskModule {}
