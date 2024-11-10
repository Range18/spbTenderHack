import { AxiosResponse } from 'axios';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AuctionDataRdo } from '#src/core/auctions/rdo/auction-data.rdo';
import { MosRuApiService } from '#src/core/mos-ru-api/mos-ru-api.service';
import { FilesService } from '#src/core/files/files.service';
import { ReasonsToClose } from '#src/core/auctions/types/reasons-to-close.enum';
import { AnalyticsRdo } from '#src/core/results/rdo/analytics.rdo';
import { CheckAuctionsDto } from '#src/core/auctions/dto/check-auctions.dto';
import { ResultsService } from '#src/core/results/results.service';
import { MlApiService } from '#src/core/ml-api/ml-api.service';
import { CriteriaService } from '#src/core/results/criteria.service';
import { ResultCacheService } from '#src/core/results/result-cache.service';
import { difference } from '#src/common/utils/sets-diff.func';
import { FileForMlType } from '#src/core/files/types/file-for-ml.type';
import { TableRdo } from '#src/core/results/rdo/table.rdo';
import * as console from 'node:console';
import { IsIncludes } from '#src/common/utils/is-includes.func';

@Injectable()
export class AuctionsService {
  constructor(
    private readonly mosRuApiService: MosRuApiService,
    private readonly filesService: FilesService,
    private readonly resultsService: ResultsService,
    private readonly criteriaService: CriteriaService,
    private readonly resultCacheService: ResultCacheService,
    private readonly mlApiService: MlApiService,
  ) {}

  private parseAuctionId(url: string) {
    return Number(url.slice(url.lastIndexOf('/') + 1));
  }

  async checkAuctions(checkAuctionsDto: CheckAuctionsDto) {
    const auctionIds = checkAuctionsDto.urls.map((url) =>
      this.parseAuctionId(url),
    );
    const { resultCachedEntities, group } =
      await this.resultCacheService.createNewAndGetCached(auctionIds);

    const criteriaSet = new Set(checkAuctionsDto.criteria);
    for (const url of checkAuctionsDto.urls) {
      const auctionId = this.parseAuctionId(url);
      const calculatedCriteria = resultCachedEntities[auctionId]
        ? new Set(
            resultCachedEntities[auctionId].criteria.map(
              (criteria) => criteria.type,
            ),
          )
        : null;
      const criteriaToCalculate = calculatedCriteria
        ? difference(criteriaSet, calculatedCriteria).values()
        : criteriaSet.values();

      const result = await this.checkAuction(
        url,
        Array.from(criteriaToCalculate).sort(),
      );

      console.log('result', result);
      const resultEntity = await this.resultsService.updateOne(
        { auctionId },
        {
          isPublished: result.isPublished,
          reason: result.reason ? result.reason.join(';') : undefined,
          isCompleted: true,
        },
      );

      await this.criteriaService.saveMany(auctionId, result.table);
    }

    return group.id;
  }

  async checkAuction(url: string, criteria: number[]): Promise<AnalyticsRdo> {
    const auctionId = this.parseAuctionId(url);
    const auctionResponse: AxiosResponse<AuctionDataRdo> =
      await this.mosRuApiService
        .getHttpClient()
        .get('/Auction/Get?auctionId=' + auctionId);

    if (!auctionResponse.data || auctionResponse.status == HttpStatus.NOT_FOUND)
      throw new NotFoundException();

    const [IsTaskFile, IsContractProjectFile] = this.checkFiles(
      auctionResponse.data.files,
    );
    if (!IsTaskFile || !IsContractProjectFile) {
      const reason = [];
      if (!IsTaskFile) reason.push(ReasonsToClose.NoTaskFIle);
      if (!IsContractProjectFile)
        reason.push(ReasonsToClose.NoContractProjectFile);
      return { url: url, isPublished: false, auctionId, reason: reason };
    }

    const files = await this.filesService.getFilesPayload(
      auctionResponse.data.files,
    );

    console.log(files);
    const taskFile = files.find((file) =>
      IsIncludes(file.filename, ['тз', 'тех', 'задание', 'техническое']),
    );
    const contractProjectFile = files.find((file) =>
      IsIncludes(file.filename, ['пк', 'проект', 'контракт']),
    );

    if (taskFile.text.length < 100 || contractProjectFile.text.length < 100) {
      const reason = [];
      if (taskFile.text.length < 100) reason.push('Пустое ТЗ');
      if (contractProjectFile.text.length < 100)
        reason.push('Пустой проект контракта');
      return { url: url, isPublished: false, auctionId, reason: reason };
    }

    const criteriaTable = await this.CalculateCriteria(
      auctionResponse.data,
      taskFile,
      contractProjectFile,
      criteria,
    );

    return {
      url,
      isPublished: criteriaTable.every((entry) =>
        typeof entry.isOk == 'string' ? entry.isOk == 'True' : entry.isOk,
      ),
      auctionId,
      table: criteriaTable,
    };
  }

  private checkFiles(
    files: Array<{
      companyId: number | null;
      name: string;
      id: number;
    }>,
  ) {
    const IsTaskFile = files.find((file) =>
      IsIncludes(file.name, ['тз', 'тех', 'задание', 'техническое']),
    );
    const IsContractProjectFile = files.find((file) =>
      IsIncludes(file.name, ['пк', 'проект', 'контракт']),
    );

    return [IsTaskFile, IsContractProjectFile];
  }

  private async CalculateCriteria(
    auctionData: AuctionDataRdo,
    taskFile: FileForMlType,
    contractProjectFile: FileForMlType,
    criteriaToCalculate: number[],
  ) {
    const criteriaResults: TableRdo[] = [];
    for (const criteria of criteriaToCalculate) {
      switch (criteria) {
        case 1: {
          const first = await this.mlApiService.checkFirstPoint(
            auctionData,
            taskFile,
            contractProjectFile,
          );
          criteriaResults.push({
            name: 'Наименование закупки',
            isOk: first.status,
            cardValue: first.KC,
            taskFileValue: first.TZ,
            contractProjectFileValue: first.PK,
            type: 1,
          });
          break;
        }

        case 2: {
          const second = await this.mlApiService.checkSecondPoint(
            auctionData,
            contractProjectFile,
          );
          criteriaResults.push({
            name: 'Обеспечение исполнения контракта',
            type: 2,
            isOk: second.status,
          });

          break;
        }

        case 3: {
          const third = await this.mlApiService.checkThirdPoint(
            taskFile,
            contractProjectFile,
          );
          criteriaResults.push({
            name: 'Требования к сертификатам/лицензиям',
            type: 3,
            isOk: third.status,
            cardValue: third.KC,
            taskFileValue: third.TZ,
            contractProjectFileValue: third.PK,
          });
          break;
        }

        case 4: {
          const fourth = await this.mlApiService.checkFourthPoint(
            auctionData,
            taskFile,
            contractProjectFile,
          );
          criteriaResults.push({
            name: 'График и этапы поставки',
            type: 4,
            isOk: fourth.TZ && fourth.PK,
          });
          break;
        }

        case 5: {
          const fifth = await this.mlApiService.checkFifthPoint(
            auctionData,
            contractProjectFile,
          );
          criteriaResults.push({
            name: 'Тип ценовой информации',
            type: 5,
            isOk: fifth.status,
            cardValue: fifth.KC,
            taskFileValue: fifth.TZ,
            contractProjectFileValue: fifth.PK,
          });
          break;
        }

        case 6: {
          const six = await this.mlApiService.checkSixPoint(
            auctionData,
            taskFile,
          );
          criteriaResults.push({
            name: 'Спецификация товаров/услуг',
            type: 6,
            isOk: six.status,
            cardValue: six.KC,
            taskFileValue: six.TZ,
            contractProjectFileValue: six.PK,
          });
          break;
        }
        case 7: {
          ('Реквизиты Заказчика');
        }

        case 8: {
          ('Правильность выбранной категории');
        }

        case 9: {
          ('Проверка на грамматические ошибки');
        }
      }
    }

    return criteriaResults;
  }

  async getDocs(url: string) {
    const auctionId = this.parseAuctionId(url);
    const auctionResponse: AxiosResponse<AuctionDataRdo> =
      await this.mosRuApiService
        .getHttpClient()
        .get('/Auction/Get?auctionId=' + auctionId);

    if (!auctionResponse.data || auctionResponse.status == HttpStatus.NOT_FOUND)
      throw new NotFoundException();

    const files = await this.filesService.getFilesPayload(
      auctionResponse.data.files,
    );
    const taskFile = files.find((file) =>
      IsIncludes(file.filename, ['тз', 'тех', 'задание', 'техническое']),
    );
    const contractProjectFile = files.find((file) =>
      IsIncludes(file.filename, ['пк', 'проект', 'контракт']),
    );

    return { ТЗ: taskFile, ПК: contractProjectFile };
  }
}
