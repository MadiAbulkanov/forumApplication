import { RequestHandler } from 'express';
import { Route } from './Route.interface';
export interface AppInit {
  port: number;
  middlewares: RequestHandler[];
  routes: Route[];
}