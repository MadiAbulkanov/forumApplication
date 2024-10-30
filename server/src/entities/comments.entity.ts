import { Posts } from "@/entities/posts.entity";
import { User } from "@/entities/user.entity";
import { IComments } from "@/interfaces/comments.interface";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
@Entity({ name: 'comments' })
export class Comments implements IComments {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  users!: User

  @Column()
  postId!: number;

  @ManyToOne(() => Posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post!: Posts

  @Column()
  datatime!: string;

  @Column()
  comments!: string;
};