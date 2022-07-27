import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schema/file.schema';
import { S3Service } from 'src/services/s3-service/s3.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: File.name,
        schema: FileSchema
      }
    ])
  ],
  controllers: [FilesController],
  providers: [
    S3Service,
    FilesService
  ]
})
export class FilesModule {}
