import { IsNotEmpty } from "class-validator";
export class CreateUnsplashDto {
    @IsNotEmpty()
    url: string;
}
