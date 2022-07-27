import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, UseGuards } from '@nestjs/common';
import { UnsplashService } from './unsplash.service';
import { CreateUnsplashDto } from './dto/create-unsplash.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { S3Service } from 'src/services/s3-service/s3.service';
import { FilesService } from 'src/files/files.service';
import { CreateFileDto } from 'src/files/dto/create-file.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('unsplash')
@Controller('unsplash')
export class UnsplashController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly filesService: FilesService,
    private readonly unsplashService: UnsplashService
  ) {}

  @Post('upload')
  async create(@Body() createUnsplashDto: CreateUnsplashDto) {
    const imageURL = createUnsplashDto.url;
    const fileName = this.getFileName(imageURL);
    const imgResp = await fetch(imageURL);
    const imgBuffer = Buffer.from(await imgResp.arrayBuffer());

    const uploadedFile = await this.s3Service.uploadFile(imgBuffer, fileName);

    const newDocument = new CreateFileDto(
      fileName,
      uploadedFile.Key,
      uploadedFile.Location,
    );

    return this.filesService.create(newDocument);
  }

  /* Get a list of images from unsplash */
  @Get('list')
  findAll() {
    return this.unsplashService.listImages();
  }

  private getFileName(url: string): string {
    const newUrl = new URL(url);
    return newUrl.pathname.substring(1);
  }
}
