import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../entities';
import { SchedulePaginationDto } from '../dtos/input';

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
    return await this._scheduleRepository.find({
      relations: ['scheduleValue'],
      order: {
        createdAt: 'DESC',
      }
    });
  }

  async findPaginated(
    paginationDto: SchedulePaginationDto,
  ): Promise<Schedule[]> {
    const { limit = 10, offset = 1, search } = paginationDto;
    return await this._scheduleRepository.find({
      relations: ['typeSchedule', 'scheduleValue'],
      // order: {
      //   createdAt: 'DESC',
      // },
      skip: offset > 0 ? (offset - 1) * limit : 0,
      take: limit,
    });
  }

  async findAllActive(): Promise<Schedule[]> {
    return await this._scheduleRepository.find({
      where: {
        isActive: true,
      },
    });
  }

  async findOneById(id: string): Promise<Schedule> {
    const schedule = await this._scheduleRepository.findOne({
      relations: ['typeSchedule', 'scheduleValue'],
      where: {
        id,
      },
    });

    if (!schedule)
      throw new BadRequestException('No se ha encontrado el cronograma');

    return schedule;
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
