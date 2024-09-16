import {
  IsNumber,
  IsObject,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateScheduleValueDto } from './create-schedule-value.dto';
import { Type } from 'class-transformer';

export class CreateScheduleDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => CreateScheduleValueDto)
  scheduleValue: CreateScheduleValueDto;
}
