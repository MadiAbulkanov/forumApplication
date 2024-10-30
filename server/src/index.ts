import cors from 'cors';
import App from './app';
import logger from './middlewares/logger';
import { PostsRoute } from '@/routes/posts.route';
import { CommentsRoute } from '@/routes/comments.route';
import { AuthRoute } from '@/routes/auth.route';

const app = new App({
  port: 8000,
  middlewares: [logger(), cors()],
  routes: [ new PostsRoute(), new CommentsRoute(), new AuthRoute() ],
});

app.listen();