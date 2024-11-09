import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultEntity } from '#src/core/results/entitites/result.entity';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

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

  async findOne(options: FindOneOptions<ResultEntity>): Promise<ResultEntity> {
    return await this.resultsRepository.findOne(options);
  }

  async save(entity: DeepPartial<ResultEntity>) {
    return await this.resultsRepository.save(entity);
  }

  async updateOne(
    options: FindOptionsWhere<ResultEntity>,
    data: DeepPartial<ResultEntity>,
  ): Promise<ResultEntity> {
    const result = await this.resultsRepository.findOne({ where: options });
    if (!result) throw new NotFoundException();
    const newResult = this.resultsRepository.merge(result, data);
    return await this.resultsRepository.save(newResult);
  }
}
