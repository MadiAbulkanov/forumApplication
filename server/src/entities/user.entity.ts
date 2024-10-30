import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  token?: string;

  async comparePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }

  generateToken() {
    this.token = crypto.randomUUID();
  }
}