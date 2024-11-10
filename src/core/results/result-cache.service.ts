import { Injectable } from '@nestjs/common';
import { ResultsService } from '#src/core/results/results.service';
import { GroupsService } from '#src/core/results/groups.service';
import { ResultEntity } from '#src/core/results/entitites/result.entity';

@Injectable()
export class ResultCacheService {
  constructor(
    private readonly resultsService: ResultsService,
    private readonly groupsService: GroupsService,
  ) {}

  async createNewAndGetCached(auctionIds: number[]) {
    const group = await this.groupsService.save({});
    const resultCachedEntities: { [key in number]: ResultEntity } = {};
    group.results = group.results ? group.results : [];
    for (const auctionId of auctionIds) {
      const resultCachedEntity = await this.resultsService.findOne({
        where: { auctionId },
        relations: { criteria: true },
      });

      if (resultCachedEntity) {
        resultCachedEntities[auctionId] = resultCachedEntity;
        group.results.push(resultCachedEntity);
        continue;
      }

      const resultEntity = await this.resultsService.save({
        auctionId: auctionId,
      });
      group.results.push(resultEntity);
    }
    await this.groupsService.save(group);
    return { resultCachedEntities, group };
  }
}
