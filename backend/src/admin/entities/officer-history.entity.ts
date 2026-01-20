import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';

export enum ChangeType {
  UNIT = 'unit',
  STATUS = 'status',
}

@Entity('officer_history')
export class OfficerHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'officer_id' })
  officerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'officer_id' })
  officer: User;

  @Column({
    type: 'enum',
    enum: ChangeType,
  })
  changeType: ChangeType;

  @Column({ name: 'old_value', nullable: true })
  oldValue: string;

  @Column({ name: 'new_value' })
  newValue: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn({ name: 'change_date' })
  changeDate: Date;
}
