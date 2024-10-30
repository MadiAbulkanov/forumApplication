import { AuthController } from '@/controllers/auth.controller';
import { Route } from '@/interfaces/Route.interface';
import { Router } from 'express';

export class AuthRoute implements Route {
  public path = '/users';
  public router = Router();

  private controller: AuthController;

  constructor() {
    this.controller = new AuthController();
    this.init();
  }

  private init() {
    this.router.get('/', this.controller.getUsers);
    this.router.get('/:id', this.controller.getUser);
    this.router.post('/', this.controller.register);
    this.router.post('/sessions', this.controller.login);
  }
}