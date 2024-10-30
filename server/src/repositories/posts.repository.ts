import { appDataSource } from '@/config/dataSource';
import { PostsDto } from '@/dto/posts.dto';
import { Posts } from '@/entities/posts.entity';
import { IPosts } from '@/interfaces/posts.interface';
import { Repository } from 'typeorm';

export class PostsRepository extends Repository<Posts> {
  constructor() {
    super(Posts, appDataSource.createEntityManager());
  }

  async getPosts(): Promise<IPosts[]> {
    return await this.find({
      order: {
        datatime: 'DESC',
      }
    });
  }

  async getPost(id: number): Promise<IPosts | null> {
    const post = await this.findOne({
      where: { id },
    });
    if (!post) {
      throw new Error('Пост с таким идентификатором не существует');
    }
    return post;
  }

  async createPost(postDto: PostsDto, userId: number): Promise<IPosts | null> {
    const post = this.create({
      title: postDto.title,
      description: postDto.description,
      image: postDto.image,
      datatime: postDto.datatime,
      userId: userId,
    });
    return await this.save(post);
  }

  async deletePost(id: number): Promise<void> {
    const result = await this.delete(id);
    if (result.affected === 0) {
      throw new Error('Пост с таким идентификатором не существует');
    }
  }
};