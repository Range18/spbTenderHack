import { Controller, Get, Query } from '@nestjs/common';
import { ResultsService } from '#src/core/results/results.service';
import { GroupsService } from '#src/core/results/groups.service';
import { GroupRdo } from '#src/core/results/rdo/group.rdo';

@Controller('groups/:groupsId/results')
export class ResultsController {
  constructor(
    private readonly resultsService: ResultsService,
    private readonly groupsService: GroupsService,
  ) {}

  @Get()
  async getResults(@Query('groupsId') groupId: number) {
    const group = await this.groupsService.findOne({
      where: { id: groupId },
      relations: { results: true },
    });

    return new GroupRdo(group);
  }
}
