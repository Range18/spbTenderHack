import { Injectable } from '@nestjs/common';
import { ResultsService } from '#src/core/results/results.service';
import { GroupsService } from '#src/core/results/groups.service';
import { GroupEntity } from '#src/core/results/entitites/group.entity';
import { ResultEntity } from '#src/core/results/entitites/result.entity';

@Injectable()
export class ResultCacheService {
  constructor(
    private readonly resultsService: ResultsService,
    private readonly groupsService: GroupsService,
  ) {}

  async createNewAndGetCached(group: GroupEntity, auctionIds: number[]) {
    const resultCachedEntities: { [key in number]: ResultEntity } = {};
    for (const auctionId of auctionIds) {
      const resultCachedEntity = await this.resultsService.findOne({
        where: { auctionId },
      });

      if (resultCachedEntity) {
        resultCachedEntities[auctionId] = resultCachedEntity;
        continue;
      }

      const resultEntity = await this.resultsService.save({
        auctionId: auctionId,
      });
      group.results.push(resultEntity);
    }
    await this.groupsService.save(group);
    return resultCachedEntities;
  }
}
