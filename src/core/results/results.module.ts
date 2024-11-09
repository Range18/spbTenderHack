import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultEntity } from '#src/core/results/entitites/result.entity';
import { ResultsService } from '#src/core/results/results.service';
import { ResultsController } from '#src/core/results/results.controller';
import { GroupsService } from '#src/core/results/groups.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResultEntity])],
  providers: [ResultsService, GroupsService],
  controllers: [ResultsController],
  exports: [ResultsService],
})
export class ResultsModule {}
