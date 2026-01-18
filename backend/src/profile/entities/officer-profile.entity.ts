
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/user.entity';

export enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    OTHER = 'Other',
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

    @Column({ name: 'union_position' })
    unionPosition: string;

    @Column()
    department: string;

    @Column({ type: 'date', name: 'join_date', default: () => 'CURRENT_DATE' })
    joinDate: Date;

    @Column({ name: 'is_party_member', default: false })
    isPartyMember: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
