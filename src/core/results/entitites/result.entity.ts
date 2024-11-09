import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GroupEntity } from '#src/core/results/entitites/group.entity';
import { CriteriaEntity } from '#src/core/results/entitites/criteria.entity';

@Entity()
export class ResultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  auctionId: number;

  @Column({ nullable: true })
  isPublished?: boolean;

  @Column({ nullable: true })
  reason?: string;

  @ManyToMany(() => GroupEntity, (group) => group.results)
  groups: GroupEntity[];

  @Column({ default: false })
  isCompleted: boolean;

  @OneToMany(() => CriteriaEntity, (criteria) => criteria.result, {
    eager: true,
  })
  criteria?: CriteriaEntity[];
}
