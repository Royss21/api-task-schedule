export class CreateScheduleDto {
  name: string;
  intervalMinutes?: number;
  time?: string;
  typeTime?: string;
  startTime?: string;
  endTime?: string;
  daysOfWeek?: number[];
  typeScheduleCode: string;
  endpointUrl: string;
}
