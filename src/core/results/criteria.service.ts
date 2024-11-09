import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, Repository } from 'typeorm';
import { CriteriaEntity } from '#src/core/results/entitites/criteria.entity';

@Injectable()
export class CriteriaService {
  constructor(
    @InjectRepository(CriteriaEntity)
    private readonly criteriaRepository: Repository<CriteriaEntity>,
  ) {}

  async findAll(
    options: FindManyOptions<CriteriaEntity>,
  ): Promise<CriteriaEntity[]> {
    return await this.criteriaRepository.find(options);
  }

  async save(entity: DeepPartial<CriteriaEntity>) {
    return await this.criteriaRepository.save(entity);
  }
}
