import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, Repository } from 'typeorm';
import { CriteriaEntity } from '#src/core/results/entitites/criteria.entity';
import { ResultsService } from '#src/core/results/results.service';

@Injectable()
export class CriteriaService {
  constructor(
    @InjectRepository(CriteriaEntity)
    private readonly criteriaRepository: Repository<CriteriaEntity>,
    private readonly resultsService: ResultsService,
  ) {}

  async findAll(
    options: FindManyOptions<CriteriaEntity>,
  ): Promise<CriteriaEntity[]> {
    return await this.criteriaRepository.find(options);
  }

  async save(entity: DeepPartial<CriteriaEntity>) {
    return await this.criteriaRepository.save(entity);
  }

  async saveMany(auctionId: number, entities: DeepPartial<CriteriaEntity[]>) {
    console.log('criteria:', entities);
    const result = await this.resultsService.findOne({ where: { auctionId } });
    if (Array.isArray(entities)) {
      for (const entity of entities) {
        await this.save({
          ...entity,
          result: { id: result.id },
        });
      }
    }
  }
}
