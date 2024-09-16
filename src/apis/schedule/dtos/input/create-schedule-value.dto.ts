import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  arrayMinSize,
  IsArray,
  IsEnum,
  IsString,
  IsUrl,
  Matches,
  ValidateIf,
} from 'class-validator';
import { regexHour } from 'src/common/constants';
import { IsBeforeTime } from 'src/common/decorators';
import { DaysOfWeek, TypeSchedule, TypeTime } from 'src/common/enums';

export class CreateScheduleValueDto {
  @IsString()
  @IsUrl()
  urlEndpoint: string;

  @IsEnum(TypeSchedule)
  @IsString()
  typeScheduleCode: TypeSchedule;

  @ValidateIf((val: CreateScheduleValueDto): boolean =>
    [TypeSchedule.INTERVAL, TypeSchedule.INTERVAL_BETWEEN].includes(
      val.typeScheduleCode,
    ),
  )
  @IsString()
  @IsEnum(TypeTime)
  typeTime: TypeTime;

  @ValidateIf((val: CreateScheduleValueDto): boolean =>
    [
      TypeSchedule.SPECIFIC_TIME,
      TypeSchedule.INTERVAL,
      TypeSchedule.INTERVAL_BETWEEN,
    ].includes(val.typeScheduleCode),
  )
  @IsString()
  value?: string;

  // @ValidateIf((val: CreateScheduleValueDto): boolean =>
  //   [TypeSchedule.INTERVAL_BETWEEN].includes(val.typeScheduleCode),
  // )
  // @IsNumber()
  // @IsOptional()
  // intervalMinutes?: number;

  @ValidateIf((val: CreateScheduleValueDto): boolean =>
    [TypeSchedule.INTERVAL_BETWEEN].includes(val.typeScheduleCode),
  )
  @IsString()
  @Matches(regexHour, {
    message: 'The time must be in the format HH:MM',
  })
  @IsBeforeTime('endTime')
  startTime?: string;

  @ValidateIf((val: CreateScheduleValueDto): boolean =>
    [TypeSchedule.INTERVAL_BETWEEN].includes(val.typeScheduleCode),
  )
  @IsString()
  @Matches(regexHour, {
    message: 'The time must be in the format HH:MM',
  })
  endTime?: string;

  @ValidateIf((val: CreateScheduleValueDto): boolean =>
    [TypeSchedule.SPECIFIC_TIME, TypeSchedule.INTERVAL_BETWEEN].includes(
      val.typeScheduleCode,
    ),
  )
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(DaysOfWeek, { each: true })
  // @Type(() => Number)
  daysOfWeek?: DaysOfWeek[];
}
