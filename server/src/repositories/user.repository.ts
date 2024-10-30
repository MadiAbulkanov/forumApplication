import { appDataSource } from "@/config/dataSource";
import { RegisterUserDto } from "@/dto/register-user.dto";
import { User } from "@/entities/user.entity";
import { IUser } from "@/interfaces/user.interface";
import { Repository } from "typeorm";

export class UserRepository extends Repository<User> {
    
    constructor(){
        super(User, appDataSource.createEntityManager());
    }

    async getUsers() {
        return await this.find();
    }

    async getUser(id: number): Promise<IUser | null> {
        const user = await this.findOne({
          where: { id },
        });
        if (!user) {
          throw new Error('Пользователя с таким идентификатором не существует');
        }
        return user;
    }

    async register(registerUserDto:RegisterUserDto): Promise<IUser> {
        return this.save(registerUserDto);
    }

    async login(loginUserDto:RegisterUserDto): Promise<IUser> {
        const user = await this.findOne({
            where:{ username:loginUserDto.username },
        });
        if (!user) throw Error('invalid username or password');

        const isMatch = await user.comparePassword(loginUserDto.password);
        if (!isMatch) throw Error('invalid username or password');

        user.generateToken();

        const userWithToken: IUser = await this.save(user);
        return userWithToken;   
    }

    async getUserByToken(token: string): Promise<IUser | null> {
        return await this.findOneBy({ token });
    }
}