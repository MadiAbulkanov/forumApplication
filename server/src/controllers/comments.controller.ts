import { ValidateDto } from '@/decorators/validate-dto.decorator';
import { CommentsDto } from '@/dto/comments.dto';
import { IComments } from '@/interfaces/comments.interface';
import { CommentService } from '@/services/comments.service';
import { plainToInstance } from 'class-transformer';
import { Request, RequestHandler, Response } from 'express';
export class CommentsController {
  private service: CommentService;

  constructor() {
    this.service = new CommentService();
    this.createComment = this.createComment.bind(this);
  }

  getComments: RequestHandler = async (req, res): Promise<void> => {
    const postId = req.query.post_id ? Number(req.query.post_id) : undefined;
    const comments = await this.service.getComments(postId);
    res.send(comments);
  };

  @ValidateDto(CommentsDto)
  async createComment (req: Request<object, IComments, CommentsDto>, res: Response): Promise<void>  {
    try {
      const token = req.header('Authorization');
      if (!token) {
        res.status(401).send({ error: { message: 'Unauthorized' } });
      } else {
       const commentDto = plainToInstance(CommentsDto, req.body);
       const comment = await this.service.createComment(token, commentDto);
       res.send(comment); 
      }
    } catch (e) {
      if (e instanceof Error) {
        res.status(401).send({ error: { message: e.message } });
        return;
      }
      res.status(500).send({ error: { message: 'Oops something went wrong' } });
    }
  };

  deleteComment: RequestHandler = async (req, res): Promise<void> => {
    try {
      await this.service.deleteComment(req.params.id);
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