import { Controller, Get, Post, Body, Patch, Param, UseInterceptors, UploadedFile, Res, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { NotEmptyFilePipe } from 'src/not-empty-file.pipe';
import { S3Service } from 'src/services/s3-service/s3.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly s3Service: S3Service
  ) {}

  /* Upload any file to S3 */
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile(NotEmptyFilePipe) file: Express.Multer.File) {
    const uploadedFile = await this.s3Service.uploadFile(file.buffer, file.originalname);

    const newDocument = new CreateFileDto(
      file.originalname,
      uploadedFile.Key,
      uploadedFile.Location,
    );

    return this.filesService.create(newDocument);
  }
  
  /* Download a file within the session of the user */
  @Get('download/:id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const file = await this.filesService.findOne(id);
    const fileToDownload = await this.s3Service.downloadFile(file.key);
    res.attachment(file.name);
    fileToDownload.stream.pipe(res);
  }

  @Get('create-download-link/:id')
  async getDownloadLink(@Param('id') id: string) {
    const file = await this.filesService.findOne(id);
    const urlToDownload = this.s3Service.generateLink(file.key);
    return urlToDownload;
  }

  /* Update file name in database */
  @Patch('update-file-name/:id')
  async updateName(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.updateFileName(id, updateFileDto);
  }
}
