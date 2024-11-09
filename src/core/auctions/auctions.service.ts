import { AxiosResponse } from 'axios';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AuctionDataRdo } from '#src/core/auctions/rdo/auction-data.rdo';
import { SendToMlDto } from '#src/core/auctions/dto/send-to-ml.dto';
import { MosRuApiService } from '#src/core/mos-ru-api/mos-ru-api.service';
import { FilesService } from '#src/core/files/files.service';
import { ReasonsToClose } from '#src/core/auctions/types/reasons-to-close.enum';
import { AnalyticsRdo } from '#src/core/results/rdo/analytics.rdo';
import { CheckAuctionsDto } from '#src/core/auctions/dto/check-auctions.dto';
import { GroupsService } from '#src/core/results/groups.service';
import { ResultsService } from '#src/core/results/results.service';
import { MlApiService } from '#src/core/ml-api/ml-api.service';
import { CriteriaService } from '#src/core/results/criteria.service';
import { ResultCacheService } from '#src/core/results/result-cache.service';

@Injectable()
export class AuctionsService {
  constructor(
    private readonly mosRuApiService: MosRuApiService,
    private readonly filesService: FilesService,
    private readonly groupService: GroupsService,
    private readonly resultsService: ResultsService,
    private readonly criteriaService: CriteriaService,
    private readonly resultCacheService: ResultCacheService,
    private readonly mlApiService: MlApiService,
  ) {}

  async checkAuctions(checkAuctionsDto: CheckAuctionsDto) {
    const auctionIds = checkAuctionsDto.urls.map((url) =>
      this.parseAuctionId(url),
    );
    const group = await this.groupService.save({});

    const resultCachedEntities =
      await this.resultCacheService.createNewAndGetCached(group, auctionIds);

    const criteria = checkAuctionsDto.criteria.sort();
    for (const url of checkAuctionsDto.urls) {
      const result = await this.checkAuction(url, criteria);
      const auctionId = this.parseAuctionId(url);
      const resultEntity = await this.resultsService.updateOne(
        { auctionId },
        {
          isPublished: result.isPublished,
          reason: result.reason,
          isCompleted: true,
          criteria: result.table,
        },
      );

      for (const criteria of resultEntity.criteria) {
        await this.criteriaService.save({
          ...criteria,
          result: { auctionId },
        });
      }
    }
    return;
  }

  async checkAuction(url: string, criteria: number[]): Promise<AnalyticsRdo> {
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

    const [IsTaskFile, IsContractProjectFile] = this.checkFiles(
      auctionResponse.data.files,
    );
    if (!IsTaskFile || !IsContractProjectFile) {
      const reason = [];

      if (!IsTaskFile) reason.push(ReasonsToClose.NoTaskFIle);
      if (!IsContractProjectFile)
        reason.push(ReasonsToClose.NoContractProjectFile);

      return { url: url, isPublished: false, reason: reason.join(' ') };
    }

    const files = await this.filesService.getFilesPayload(
      auctionResponse.data.files,
    );
    const taskFile = files.find((file) =>
      file.filename.toLowerCase().includes('тз'),
    );
    const contractProjectFile = files.find((file) =>
      file.filename.toLowerCase().includes('проект контракта'),
    );

    // await this.mlApiService.checkSixPoint(auctionResponse.data, taskFile);

    return { url, isPublished: true };
  }

  private parseAuctionId(url: string) {
    return Number(url.slice(url.lastIndexOf('/') + 1));
  }

  private checkFiles(
    files: Array<{
      companyId: number | null;
      name: string;
      id: number;
    }>,
  ) {
    const IsTaskFile = files.find((file) =>
      file.name.toLowerCase().includes('тз'),
    );
    const IsContractProjectFile = files.find((file) =>
      file.name.toLowerCase().includes('проект контракта'),
    );

    return [IsTaskFile, IsContractProjectFile];
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
