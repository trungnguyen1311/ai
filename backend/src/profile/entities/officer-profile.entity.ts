import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum Department {
  PROPAGANDA_EDUCATION = 'PROPAGANDA_EDUCATION',
  ORGANIZATION = 'ORGANIZATION',
  POLICIES_LAWS = 'POLICIES_LAWS',
  OFFICE = 'OFFICE',
  WOMEN_AFFAIRS = 'WOMEN_AFFAIRS',
}

export enum UnionPosition {
  PRESIDENT = 'PRESIDENT',
  VICE_PRESIDENT = 'VICE_PRESIDENT',
  EXECUTIVE_COMMITTEE_MEMBER = 'EXECUTIVE_COMMITTEE_MEMBER',
  BOARD_MEMBER = 'BOARD_MEMBER',
  SPECIALIZED_OFFICER = 'SPECIALIZED_OFFICER',
}

export enum WorkStatus {
  ACTIVE = 'ACTIVE',
  TRANSFERRED = 'TRANSFERRED',
  RETIRED = 'RETIRED',
}

@Entity('officer_profiles')
export class OfficerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @Column({ name: 'employee_id', unique: true })
  employeeId: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ type: 'date', nullable: true, name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: Gender, default: Gender.MALE })
  gender: Gender;

  @Column({ name: 'national_id', nullable: true, unique: true })
  nationalId: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ name: 'personal_email', nullable: true })
  personalEmail: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: UnionPosition,
    name: 'union_position',
    nullable: false,
  })
  unionPosition: UnionPosition;

  @Column({ type: 'enum', enum: Department, nullable: false })
  department: Department;

  @Column({ name: 'unit_name', nullable: true })
  unitName: string;

  @Column({
    type: 'enum',
    enum: WorkStatus,
    name: 'work_status',
    default: WorkStatus.ACTIVE,
  })
  workStatus: WorkStatus;

  @Column({ type: 'text', nullable: true })
  education: string;

  @Column({ type: 'text', nullable: true })
  experience: string;

  @Column({ type: 'text', nullable: true })
  skills: string;

  @Column({ type: 'text', nullable: true })
  achievements: string;

  @Column({ type: 'date', name: 'join_date', default: () => 'CURRENT_DATE' })
  joinDate: Date;

  @Column({ name: 'is_party_member', default: false })
  isPartyMember: boolean;

  @Column({ type: 'text', array: true, default: '{}' })
  tags: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
