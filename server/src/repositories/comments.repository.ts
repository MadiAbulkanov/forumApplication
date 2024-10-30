import { appDataSource } from '@/config/dataSource';
import { CommentsDto } from '@/dto/comments.dto';
import { Comments } from '@/entities/comments.entity';
import { IComments } from '@/interfaces/comments.interface';
import { Repository } from 'typeorm';
export class CommentsRepository extends Repository<Comments> {
  constructor() {
    super(Comments, appDataSource.createEntityManager());
  }

  async getComments(postId?: number): Promise<IComments[]> {
    const query = this.createQueryBuilder('comments')
    .leftJoinAndSelect('comments.post', 'posts')
    .orderBy('comments.datatime', 'DESC');

    if (postId) {
        query.where('comments.postId = :postId', { postId })
    }
    return await query.getMany();
  }

  async createComment(commentsDto: CommentsDto, userId: number): Promise<IComments> {
    const comments = this.create({
      userId: userId,
      postId: commentsDto.postId,
      datatime: commentsDto.datatime,
      comments: commentsDto.comments,
    })
    return await this.save(comments);
  }

  async deleteComment(id: number): Promise<void> {
    const result = await this.delete(id);
    if (result.affected === 0) {
      throw new Error('Комментарий с таким идентификатором не существует');
    }
  }
};