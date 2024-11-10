import { GroupEntity } from '#src/core/results/entitites/group.entity';
import { AnalyticsRdo } from '#src/core/results/rdo/analytics.rdo';

export class GroupRdo {
  id: number;

  results: AnalyticsRdo[];

  resultsCount: number;

  succeedResultsCount: number;

  constructor(group: GroupEntity) {
    this.id = group.id;
    this.results = group.results.map((result) => {
      return {
        url: `https://zakupki.mos.ru/auction/${result.auctionId}`,
        auctionId: result.auctionId,
        isPublished: result.isPublished,
        reason: result.reason ? result.reason.split(';') : null,
        table: result.criteria.map((entry) => {
          return {
            name: entry.name,
            type: entry.type,
            isOk: entry.isOk,
            cardValue: entry.cardValue,
            taskFileValue: entry.taskFileValue,
            contractProjectFileValue: entry.contractProjectFileValue,
          };
        }),
      } as AnalyticsRdo;
    });
    this.resultsCount = group.results.length;
    this.succeedResultsCount = group.results.filter(
      (result) => result.isCompleted,
    ).length;
  }
}
