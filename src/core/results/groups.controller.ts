import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { GroupsService } from '#src/core/results/groups.service';
import { GroupRdo } from '#src/core/results/rdo/group.rdo';

@Controller('groups/:groupsId/results')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  async getGroup(@Query('groupsId') groupId: number): Promise<GroupRdo> {
    const group = await this.groupsService.findOne({
      where: { id: groupId },
      relations: { results: { criteria: true } },
    });

    if (!group) throw new NotFoundException(`Group ${groupId} not found`);

    return new GroupRdo(group);
  }
}
