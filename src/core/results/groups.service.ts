import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { GroupEntity } from '#src/core/results/entitites/group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupsRepository: Repository<GroupEntity>,
  ) {}

  async findAll(options: FindManyOptions<GroupEntity>): Promise<GroupEntity[]> {
    return await this.groupsRepository.find(options);
  }

  async findOne(options: FindOneOptions<GroupEntity>): Promise<GroupEntity> {
    return await this.groupsRepository.findOne(options);
  }

  async save(entities: DeepPartial<GroupEntity>) {
    return await this.groupsRepository.save(entities);
  }
}
