import { PostsDto } from '@/dto/posts.dto';
import { formatErrors } from '@/helpers/formatErrors';
import { IPosts } from '@/interfaces/posts.interface';
import { PostsRepository } from '@/repositories/posts.repository';
import { UserRepository } from '@/repositories/user.repository';
import { validate } from 'class-validator';
export class PostService {
  private repository: PostsRepository;
  private userRepository: UserRepository;

  constructor() {
    this.repository = new PostsRepository();
    this.userRepository = new UserRepository();
  }

  getPosts = async (): Promise<IPosts[]> => {
    return await this.repository.getPosts();
  };

  getPost = async (paramsId: string): Promise<IPosts> => {
    const id = Number(paramsId);
    if (isNaN(id)) {
      throw Error('invalid id');
    }
    const news = await this.repository.getPost(id);
    if (news) return news;
    else throw new Error('invalid id');
  };

  createPost = async (token: string, postDto: PostsDto): Promise<IPosts | null> => {
    const errors = await validate(postDto, { whitelist: true, validationError: { target: false, value: false } });
    if (errors.length) throw formatErrors(errors);
    const user = await this.userRepository.getUserByToken(token);
    if (!user) {
        throw new Error('Unauthorized');
    }
    postDto.datatime = new Date().toISOString();
    return await this.repository.createPost(postDto, user.id);
  };

  deletePost = async (paramsId: string): Promise<void> => {
    const id = Number(paramsId);
    if (isNaN(id)) {
      throw Error('Invalid ID');
    }
    await this.repository.deletePost(id);
  };
};