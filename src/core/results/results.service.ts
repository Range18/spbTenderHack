import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultEntity } from '#src/core/results/entitites/result.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(ResultEntity)
    private readonly resultsRepository: Repository<ResultEntity>,
  ) {}

  async findAll(
    options: FindManyOptions<ResultEntity>,
  ): Promise<ResultEntity[]> {
    return await this.resultsRepository.find(options);
  }
}
