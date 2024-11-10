import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ResultEntity } from '#src/core/results/entitites/result.entity';

@Entity()
export class CriteriaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ResultEntity, (result) => result.criteria)
  @JoinColumn()
  result: ResultEntity;

  @Column()
  name: string;

  @Column()
  type: number;

  @Column()
  isOk: boolean;

  @Column({ nullable: true, type: 'longtext' })
  cardValue?: string;

  @Column({ nullable: true, type: 'longtext' })
  taskFileValue?: string;

  @Column({ nullable: true, type: 'longtext' })
  contractProjectFileValue?: string;
}
