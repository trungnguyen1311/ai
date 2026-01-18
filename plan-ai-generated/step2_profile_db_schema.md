# Database Schema: officer_profiles

```sql
-- Create Enum for Gender if not exists
CREATE TYPE gender_enum AS ENUM ('Male', 'Female', 'Other');

-- Create Table
CREATE TABLE officer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    
    -- Identity (Immutable)
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender gender_enum DEFAULT 'Male',
    national_id VARCHAR(20) UNIQUE,
    
    -- Contact (Mutable)
    phone_number VARCHAR(20),
    personal_email VARCHAR(100),
    address TEXT,
    
    -- Union Work (Immutable)
    union_position VARCHAR(100) NOT NULL, -- Could be FK in future
    department VARCHAR(100) NOT NULL,     -- Could be FK in future
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_party_member BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_officer_profiles_user_id ON officer_profiles(user_id);
CREATE INDEX idx_officer_profiles_employee_id ON officer_profiles(employee_id);
```

## TypeORM Entity Draft
```typescript
@Entity('officer_profiles')
export class OfficerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'employee_id', unique: true })
  employeeId: string;

  @Column({ name: 'full_name' })
  fullName: string;

  // ... other columns mapped
}
```
