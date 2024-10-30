import { CommentsDto } from '@/dto/comments.dto';
import { formatErrors } from '@/helpers/formatErrors';
import { IComments } from '@/interfaces/comments.interface';
import { CommentsRepository } from '@/repositories/comments.repository';
import { UserRepository } from '@/repositories/user.repository';
import { validate } from 'class-validator';

export class CommentService {
  private repository: CommentsRepository;
  private userRepository: UserRepository;

  constructor() {
    this.repository = new CommentsRepository();
    this.userRepository = new UserRepository();
  }

  getComments = async (postId?: number): Promise<IComments[]> => {
    return await this.repository.getComments(postId);
  };

  createComment = async (token: string, commentDto: CommentsDto): Promise<IComments> => {
    try {
      const errors = await validate(commentDto, { whitelist: true, validationError: { target: false, value: false } });
    if (errors.length) throw formatErrors(errors);

    const user = await this.userRepository.getUserByToken(token);
    if (!user) {
        throw new Error('Unauthorized');
    }
    commentDto.datatime = new Date().toISOString();
    return await this.repository.createComment(commentDto, user.id);
    } catch (e) {
      console.error('Error in createComment service:', e);
      throw e;
    }
  };

  deleteComment = async (paramsId: string): Promise<void> => {
    const id = Number(paramsId);
    if (isNaN(id)) {
      throw Error('Invalid ID');
    }
    await this.repository.deleteComment(id);
  };
};