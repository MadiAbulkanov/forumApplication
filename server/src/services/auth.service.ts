import config from "@/config";
import { RegisterUserDto } from "@/dto/register-user.dto";
import { ResponseUserDto } from "@/dto/response-user.dto";
import { IUser } from "@/interfaces/user.interface";
import { UserRepository } from "@/repositories/user.repository";
import bcrypt from 'bcrypt';
import { plainToInstance } from "class-transformer";

export class AuthService {
    private repository:UserRepository

    constructor() {
        this.repository = new UserRepository();
    }

    async getUsers () {
        return await this.repository.getUsers();
    }

    async getUser (paramsId: string) {
        const id = Number(paramsId);
        if (isNaN(id)) {
          throw Error('invalid id');
        }
        const user = await this.repository.getUser(id);
        if (user) return user;
        else throw new Error('invalid id');
      };

    async register(registerUserDto:RegisterUserDto):Promise<IUser> {
        const salt = await bcrypt.genSalt(config.SALT_WARK_FACTOR);
        registerUserDto.password = await bcrypt.hash(registerUserDto.password, salt);
        const newUser = await this.repository.register(registerUserDto);
        return plainToInstance(ResponseUserDto, newUser);
    }

    async login(loginUserDto: RegisterUserDto): Promise<IUser> {
        const user = await this.repository.login(loginUserDto);
        return plainToInstance(ResponseUserDto, user);
    }

    async getUserByToken (token: string): Promise<IUser | null> {
        return await this.repository.getUserByToken(token);
    };
}