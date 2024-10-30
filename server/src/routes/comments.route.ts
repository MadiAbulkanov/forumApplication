import { CommentsController } from "@/controllers/comments.controller";
import { Route } from "@/interfaces/Route.interface";
import { upload } from "@/middlewares/upload";
import { Router } from "express";

export class CommentsRoute implements Route {
  public path = '/comments';
  public router = Router();

  private controller: CommentsController;

  constructor() {
    this.controller = new CommentsController();
    this.init();
  }

  private init() {
    this.router.get('/', this.controller.getComments);
    this.router.delete('/:id', this.controller.deleteComment);
    this.router.post('/', upload.none(), this.controller.createComment);
  }
};