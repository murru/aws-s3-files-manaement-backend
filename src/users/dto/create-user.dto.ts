import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    fullname: string;
    email: string;
    password: string;
}
