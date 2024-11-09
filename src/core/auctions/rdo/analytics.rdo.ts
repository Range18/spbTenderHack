import { TableRdo } from '#src/core/auctions/rdo/tableRdo';

export class AnalyticsRdo {
  url: string;

  isPublished: boolean;

  reason?: string;

  table?: TableRdo[];
}
