import { PositionDto } from '#src/core/auctions/dto/position.dto';

export class SupplyScheduleDto {
  'Срок': string;
  'Адрес Доставки': string;
  'Позиции': PositionDto[];
}
