import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, StreamableFile, Put } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { NotEmptyFilePipe } from 'src/not-empty-file.pipe';
import { S3Service } from 'src/s3-service/s3.service';
import { Response } from 'express';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly s3Service: S3Service
  ) {}

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

  @Patch('update-file-name/:id')
  async updateName(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.updateFileName(id, updateFileDto);
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
