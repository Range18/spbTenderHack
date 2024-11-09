import { TableRdo } from '#src/core/results/rdo/table.rdo';

export class AnalyticsRdo {
  url: string;

  isPublished: boolean;

  reason?: string;

  table?: TableRdo[];
}
