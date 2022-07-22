import { IsNotEmpty } from "class-validator";

export class CreateFileDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    key: string;
    @IsNotEmpty()
    location: string;

    constructor(name: string, key: string, location: string) {
        this.name = name;
        this.key = key;
        this.location = location;
    }
}
