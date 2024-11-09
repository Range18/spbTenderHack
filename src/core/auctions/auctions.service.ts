import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AuctionDataRdo } from '#src/core/auctions/rdo/auction-data.rdo';
import { SendToMlDto } from '#src/core/auctions/dto/send-to-ml.dto';
import { mainConfig } from '#src/common/configs/main.config';
import { MosRuApiService } from '#src/core/mos-ru-api/mos-ru-api.service';
import { FilesService } from '#src/core/files/files.service';

@Injectable()
export class AuctionsService {
  private readonly MLServiceInstance: AxiosInstance;

  constructor(
    private readonly mosRuApiService: MosRuApiService,
    private readonly filesService: FilesService,
  ) {
    this.MLServiceInstance = axios.create({
      baseURL: mainConfig.mlUrl,
    });
  }

  async checkIsRight(url: string) {
    const auctionId = this.parseAuctionId(url);

    const auctionResponse: AxiosResponse<AuctionDataRdo> =
      await this.mosRuApiService
        .getHttpClient()
        .get('/Auction/Get?auctionId=' + auctionId);

    if (
      !auctionResponse.data ||
      auctionResponse.status == HttpStatus.NOT_FOUND
    ) {
      throw new NotFoundException();
    }

    const files = await this.filesService.getFilesPayload(
      auctionResponse.data.files,
    );

    const MLDto = this.formJsonForML(auctionResponse.data);

    //TODO POST TO ML
    // const answer = await this.MLServiceInstance.post('/todo', MLDto);

    return files;
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
