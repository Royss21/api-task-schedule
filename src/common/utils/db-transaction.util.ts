import { BadRequestException } from '@nestjs/common';
import { envs } from 'src/config';
import { DataSource } from 'typeorm';

export const dbTransaction = async (
  dataSource: DataSource,
  callback: () => Promise<any>,
) => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const data = await callback();
    await queryRunner.commitTransaction();

    return data;
  } catch (error) {
    await queryRunner.rollbackTransaction();

    envs.stage === 'prod' &&
      new BadRequestException(
        'Ha ocurrido un error en el proceso de transaccion del registro',
      );
  } finally {
    await queryRunner.release();
  }
};
