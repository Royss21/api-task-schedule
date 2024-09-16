import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../entities';

export class ScheduleRepository extends Repository<Schedule> {
  constructor(
    @InjectRepository(Schedule)
    private readonly _scheduleRepository: Repository<Schedule>,
  ) {
    super(
      _scheduleRepository.target,
      _scheduleRepository.manager,
      _scheduleRepository.queryRunner,
    );
  }

  async findAll(): Promise<Schedule[]> {
    return await this._scheduleRepository.find();
  }

  async existsByUrlEndpoint(urlEndpoint: string): Promise<void> {
    const existsEmployee = await this._scheduleRepository.exists({
      where: {
        scheduleValue: {
          urlEndpoint,
        },
      },
    });

    if (existsEmployee)
      throw new BadRequestException(
        `La url del servicio ya se encuentra registrado en una configuración.`,
      );
  }

  async saveSchedule(schedule: Schedule): Promise<Schedule> {
    const createSchedule = this._scheduleRepository.create(schedule);
    return await this._scheduleRepository.save(createSchedule);
  }
}
