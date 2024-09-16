import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeSchedule } from '../entities';

export class TypeScheduleRepository extends Repository<TypeSchedule> {
  constructor(
    @InjectRepository(TypeSchedule)
    private typeScheduleRepository: Repository<TypeSchedule>,
  ) {
    super(
      typeScheduleRepository.target,
      typeScheduleRepository.manager,
      typeScheduleRepository.queryRunner,
    );
  }

  async findByCode(code: string): Promise<TypeSchedule> {
    const typeSchedule = await this.typeScheduleRepository.findOne({
      where: {
        code,
      },
    });

    if (!typeSchedule)
      throw new BadRequestException(`No existe el tipo de cronograma a crear.`);

    return typeSchedule;
  }
}
