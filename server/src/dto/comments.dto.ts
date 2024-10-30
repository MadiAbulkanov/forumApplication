import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class CommentsDto {
    @IsNotEmpty({ message: 'Комментарий не может быть создан без текста' })
    @IsString({ message: 'Комментарий должeн быть строкой' })
    @Expose() comments!: string;

    @IsNotEmpty({ message: 'Не указан пост для комментария' })
    @IsNumberString({}, { message: 'Укажите правильное значение' })
    @Expose()
    postId!: number;

    @Expose()
    datatime!: string;
};