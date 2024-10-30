import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
export class PostsDto {
    @IsNotEmpty({ message: 'Пост не может быть создан без названия' })
    @IsString({ message: 'Название должна быть строкой' })
    @Expose() title!: string;
  
    @IsOptional()
    description?: string;

    @IsOptional()
    image?: string;
  
    @Expose()
    datatime!: string;
};