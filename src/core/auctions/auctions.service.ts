import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { AuctionDataRdo } from '#src/core/auctions/rdo/auction-data.rdo';
import { SendToMlDto } from '#src/core/auctions/dto/send-to-ml.dto';
import { mainConfig } from '#src/common/configs/main.config';

export class AuctionsService {
  private readonly mosRuServiceInstance: AxiosInstance;
  private readonly MLServiceInstance: AxiosInstance;

  constructor() {
    this.mosRuServiceInstance = axios.create({
      baseURL: 'https://zakupki.mos.ru',
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      },
    });
    this.MLServiceInstance = axios.create({
      baseURL: mainConfig.ml_url,
    });
  }

  async checkIsRight(url: string) {
    const auctionId = this.parseAuctionId(url);

    const auctionResponse: AxiosResponse<AuctionDataRdo> =
      await this.mosRuServiceInstance.get(
        '/newapi/api/Auction/Get?auctionId=' + auctionId,
      );

    if (
      !auctionResponse.data ||
      auctionResponse.status == HttpStatus.NOT_FOUND
    ) {
      throw new NotFoundException();
    }

    const MLDto = this.formJsonForML(auctionResponse.data);

    //TODO POST TO ML
    const answer = await this.MLServiceInstance.post('/todo', MLDto);

    return answer;
  }

  private parseAuctionId(url: string) {
    return url.slice(url.lastIndexOf('/') + 1);
  }

  private formJsonForML(data: AuctionDataRdo) {
    const sendToMLDto = {
      Название: data.name,
      'Условия исполнения контракта':
        'Обязательное электронное исполнение с использованием УПД',
      'Обеспечение исполнения контракта': 'Не требуется',
      Заказчик: data.customer.name,
      'Заключение происходит в соответствии с законом': data.federalLawName,
      'График поставки': data.deliveries.map((delivery) => {
        return {
          Срок: `${delivery.periodDaysFrom}-${delivery.periodDaysTo}`,
          'Адрес Доставки': delivery.deliveryPlace,
          Позиции: delivery.items.map((item) => {
            return {
              Наименование: item.name,
              'Кол-во': item.quantity,
              'Цена за единицу': item.costPerUnit,
              Сумма: item.sum,
            };
          }),
        };
      }),
    } as SendToMlDto;

    return JSON.stringify(sendToMLDto);
  }
}
