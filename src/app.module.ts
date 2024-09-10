import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleTaskModule } from './apis/schedule/schedule.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ScheduleTaskModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
