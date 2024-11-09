import axios, { AxiosInstance } from 'axios';
import { mainConfig } from '#src/common/configs/main.config';
import { AuctionDataRdo } from '#src/core/auctions/rdo/auction-data.rdo';
import { FileForMlType } from '#src/core/files/types/file-for-ml.type';
import { CostType } from '#src/core/auctions/types/cost-type.enum';
import { Injectable } from '@nestjs/common';
import { MlRdo } from '#src/core/ml-api/rdo/ml.rdo';

@Injectable()
export class MlApiService {
  private readonly MLServiceInstance: AxiosInstance;

  constructor() {
    this.MLServiceInstance = axios.create({
      baseURL: mainConfig.mlUrl,
    });
  }

  async checkFirstPoint(
    data: AuctionDataRdo,
    taskFile: FileForMlType,
    contractProjectFile: FileForMlType,
  ) {
    const answer = await this.MLServiceInstance.post<MlRdo>('/crit_1', {
      'Наименование в КС': data.name,
      ТЗ: taskFile.text,
      ПК: contractProjectFile.text,
    });

    console.log(answer);
    return answer.data;
  }

  async checkSecondPoint(
    data: AuctionDataRdo,
    taskFile: FileForMlType,
    contractProjectFile: FileForMlType,
  ) {
    return data.isContractGuaranteeRequired;
  }

  async checkThirdPoint(
    taskFile: FileForMlType,
    contractProjectFile: FileForMlType,
  ) {
    const answer = await this.MLServiceInstance.post<MlRdo>('/save', {
      ТЗ: taskFile.text,
      ПК: contractProjectFile.text,
    });
    return answer.data;
  }

  async checkFourthPoint(
    data: AuctionDataRdo,
    taskFile: FileForMlType,
    contractProjectFile: FileForMlType,
  ) {
    const answer = await this.MLServiceInstance.post<MlRdo>('/save', {
      'График поставки': `${data.deliveries[0].periodDaysFrom}-${data.deliveries[0].periodDaysTo}`,
      ТЗ: taskFile.text,
      ПК: contractProjectFile.text,
    });
    return answer.data;
  }

  async checkFifthPoint(
    data: AuctionDataRdo,
    contractProjectFile: FileForMlType,
  ) {
    const answer = await this.MLServiceInstance.post<MlRdo>('/save', {
      type: data.contractCost ? CostType.contractCost : CostType.startCost,
      ПК: contractProjectFile.text,
    });
    return answer.data;
  }

  async checkSixPoint(data: AuctionDataRdo, taskFile: FileForMlType) {
    const answer = await this.MLServiceInstance.post<MlRdo>('/save', {
      specifications: data.deliveries[0].items.map((item) => {
        return {
          name: item.name,
          cost: item.costPerUnit,
          amount: item.quantity,
        };
      }),
      ТЗ: taskFile.text,
    });
    return answer.data;
  }

  getHttpClient() {
    return this.MLServiceInstance;
  }
}
