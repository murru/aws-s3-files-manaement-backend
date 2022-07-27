import { PartialType } from '@nestjs/swagger';
import { CreateUnsplashDto } from './create-unsplash.dto';

export class UpdateUnsplashDto extends PartialType(CreateUnsplashDto) {}
