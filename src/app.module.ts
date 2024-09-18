import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleTaskModule } from './apis/schedule/schedule.module';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: envs.dbHost,
      port: envs.dbPort,
      username: envs.dbUser,
      password: envs.dbPassword,
      database: envs.dbName,
      synchronize: envs.dbSynchronize,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // ssl: true,
    }),
    ScheduleModule.forRoot(),
    ScheduleTaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
