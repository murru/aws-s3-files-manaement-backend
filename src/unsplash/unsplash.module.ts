import { Module } from '@nestjs/common';
import { UnsplashService } from './unsplash.service';
import { UnsplashController } from './unsplash.controller';
import { S3Service } from 'src/services/s3-service/s3.service';
import { FilesService } from 'src/files/files.service';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from 'src/files/schema/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: File.name,
        schema: FileSchema
      }
    ])
  ],
  controllers: [
    UnsplashController
  ],
  providers: [
    S3Service,
    FilesService,
    UnsplashService
  ]
})
export class UnsplashModule {}
