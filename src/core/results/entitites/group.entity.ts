import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ResultEntity } from '#src/core/results/entitites/result.entity';

@Entity()
export class GroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => ResultEntity, (result) => result.groups)
  @JoinTable()
  results: ResultEntity[];
}
