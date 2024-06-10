import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  constructor(user?: Partial<UserEntity>) {
    this.id = user?.id;
    this.username = user?.username;
    this.password = user?.password;
    this.active = user?.active;
  }
}
