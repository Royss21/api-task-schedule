import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsString()
  @Type((): StringConstructor => String)
  search: string;

  @IsOptional()
  @Type((): NumberConstructor => Number)
  limit: number;

  @IsOptional()
  @Type((): NumberConstructor => Number)
  offset: number;
}
