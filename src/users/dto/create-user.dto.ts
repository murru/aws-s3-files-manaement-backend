import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    fullname: string;
    @IsNotEmpty()
    @IsEmail()
    @MinLength(10)
    email: string;
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}
