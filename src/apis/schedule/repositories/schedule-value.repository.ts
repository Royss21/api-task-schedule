import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleValue } from '../entities/schedule-value.entity';

export class ScheduleValueRepository extends Repository<ScheduleValue> {
  constructor(
    @InjectRepository(ScheduleValue)
    private readonly _scheduleValueRepository: Repository<ScheduleValue>,
  ) {
    super(
      _scheduleValueRepository.target,
      _scheduleValueRepository.manager,
      _scheduleValueRepository.queryRunner,
    );
  }
}
