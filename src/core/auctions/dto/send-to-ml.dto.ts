import { SupplyScheduleDto } from '#src/core/auctions/dto/supply-schedule.dto';

export class SendToMlDto {
  'Название': string;

  'Условия исполнения контракта': string;

  'Обеспечение исполнения контракта': string;

  'Заказчик': string;

  'Заключение происходит в соответствии с законом': string;

  'График поставки': SupplyScheduleDto[];
}
