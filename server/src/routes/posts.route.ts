import { PostsController } from '@/controllers/posts.controller';
import { Route } from '@/interfaces/Route.interface';
import { upload } from '@/middlewares/upload';
import { Router } from 'express';
export class PostsRoute implements Route {
  public path = '/posts';
  public router = Router();

  private controller: PostsController;

  constructor() {
    this.controller = new PostsController();
    this.init();
  }

  private init() {
    this.router.get('/', this.controller.getPosts);
    this.router.get('/:id', this.controller.getPost);
    this.router.delete('/:id', this.controller.deletePost);
    this.router.post('/', upload.single('image'), this.controller.createPost);
  }
};