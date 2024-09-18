export class PaginationOutDto<T> {
  total: number;
  data: T[];

  constructor(data: T[]) {
    this.total = data.length;
    this.data = data;
  }
}
