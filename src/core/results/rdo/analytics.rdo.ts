import { TableRdo } from '#src/core/results/rdo/table.rdo';

export class AnalyticsRdo {
  url: string;

  auctionId: number;

  isPublished: boolean;

  reason?: string[];

  table?: TableRdo[];
}
