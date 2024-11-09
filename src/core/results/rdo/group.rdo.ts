import { GroupEntity } from '#src/core/results/entitites/group.entity';
import { AnalyticsRdo } from '#src/core/results/rdo/analytics.rdo';
import { mainConfig } from '#src/common/configs/main.config';

export class GroupRdo {
  id: number;

  results: AnalyticsRdo[];

  resultsCount: number;

  succeedResultsCount: number;

  constructor(group: GroupEntity) {
    this.id = group.id;
    this.results = group.results.map((result) => {
      return {
        url: `${mainConfig.apiBaseUrl}/Auction/Get?auctionId=${result.auctionId}`,
        isPublished: result.isPublished,
        reason: result.reason,
        table: result.criteria,
      } as AnalyticsRdo;
    });
    this.resultsCount = group.results.length;
    this.succeedResultsCount = group.results.filter(
      (result) => result.isCompleted,
    ).length;
  }
}
