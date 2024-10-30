import { ValidateDto } from '@/decorators/validate-dto.decorator';
import { RegisterUserDto } from '@/dto/register-user.dto';
import { IUser } from '@/interfaces/user.interface';
import { AuthService } from '@/services/auth.service';
import { plainToInstance } from 'class-transformer';
import { Request, RequestHandler, Response } from 'express';

export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  getUsers:RequestHandler = async (_, res):Promise<void> => {
    const artist = await this.service.getUsers();
    res.send(artist);
  }

  getUser: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = await this.service.getUser(req.params.id);
      res.send(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send({ message: `${error}` });
      }
    }
  };

  @ValidateDto(RegisterUserDto)
  async register(req: Request<object, IUser, RegisterUserDto>, res: Response): Promise<void> {
    try {
      const registerUserDto = req.body;

      const user = await this.service.register(registerUserDto);

      res.send(user);
    } catch (e) {
      if ((e as { code: string }).code === 'ER_DUP_ENTRY') {
        res.status(409).send({ error: { message: 'User already exists' } });
      } else {
        res.status(500).send({ error: { message: 'Oops something went wrong' } });
      }
    }
  };

  @ValidateDto(RegisterUserDto)
  async login (req: Request<object, IUser, RegisterUserDto>, res: Response): Promise<void> {
    try {
      const loginUserDto = plainToInstance(RegisterUserDto, req.body);
      const user = await this.service.login(loginUserDto);
      res.send(user);
    } catch (e) {
      if (e instanceof Error) {
        res.status(401).send({ error: { message: e.message } });
        return;
      }
      res.status(500).send({ error: { message: 'Oops something went wrong' } });
    }
  };
}
