import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultEntity } from '#src/core/results/entitites/result.entity';
import { ResultsService } from '#src/core/results/results.service';
import { GroupsController } from '#src/core/results/groups.controller';
import { GroupsService } from '#src/core/results/groups.service';
import { GroupEntity } from '#src/core/results/entitites/group.entity';
import { CriteriaEntity } from '#src/core/results/entitites/criteria.entity';
import { CriteriaService } from '#src/core/results/criteria.service';
import { ResultCacheService } from '#src/core/results/result-cache.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResultEntity, GroupEntity, CriteriaEntity]),
  ],
  providers: [
    ResultsService,
    GroupsService,
    CriteriaService,
    ResultCacheService,
  ],
  controllers: [GroupsController],
  exports: [ResultsService, GroupsService, CriteriaService, ResultCacheService],
})
export class ResultsModule {}
