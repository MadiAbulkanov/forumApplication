import { ValidateDto } from '@/decorators/validate-dto.decorator';
import { PostsDto } from '@/dto/posts.dto';
import { IPosts } from '@/interfaces/posts.interface';
import { PostService } from '@/services/posts.service';
import { plainToInstance } from 'class-transformer';
import { Request, RequestHandler, Response } from 'express';

export class PostsController {
  private service: PostService;

  constructor() {
    this.service = new PostService();
    this.createPost = this.createPost.bind(this);
  }

  getPosts: RequestHandler = async (req, res): Promise<void> => {
    const posts = await this.service.getPosts();
    res.send(posts);
  };

  getPost: RequestHandler = async (req, res): Promise<void> => {
    try {
      const posts = await this.service.getPost(req.params.id);
      res.send(posts);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send({ message: `${error}` });
      }
    }
  };

  @ValidateDto(PostsDto)
  async createPost (req: Request<object, IPosts, PostsDto>, res: Response): Promise<void> {
    try {
      const token = req.header('Authorization');
      if (!token) {
        res.status(401).send({ error: { message: 'Unauthorized' } });
      } else {
        const postDto = plainToInstance(PostsDto, req.body);
        if (req.file) postDto.image = req.file?.filename;
        const post = await this.service.createPost(token, postDto);
        res.send(post);
      }
    } catch (e) {
      if (e instanceof Error) {
        res.status(401).send({ error: { message: e.message } });
        return;
      }
      res.status(500).send({ error: { message: 'Oops something went wrong' } });
    }
  };

  deletePost: RequestHandler = async (req, res): Promise<void> => {
    try {
      await this.service.deletePost(req.params.id);
      res.sendStatus(204);
    } catch (e) {
      if (e instanceof Error) {
        res.status(400).send({ message: `${e}` });
      } else {
        res.status(500).send(e);
      }
    }
  };
};