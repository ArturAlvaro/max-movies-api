import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'user' })
@Unique(['username'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ type: 'varchar' })
  @ApiProperty()
  username: string;

  @Column({ type: 'varchar' })
  @ApiProperty()
  password: string;

  @Column({ type: 'boolean', default: true })
  @ApiProperty()
  active: boolean;

  constructor(user?: Partial<UserEntity>) {
    this.id = user?.id;
    this.username = user?.username;
    this.password = user?.password;
    this.active = user?.active;
  }
}
