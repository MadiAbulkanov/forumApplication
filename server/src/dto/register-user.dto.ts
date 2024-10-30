import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @Expose()
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Укажите пароль' })
  password!: string;

  @Expose()
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @IsNotEmpty({ message: 'Укажите имя пользователя' })
  username!: string;
}