import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File, FileDocument } from './schema/file.schema';
import { Model } from 'mongoose';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private filesModule: Model<FileDocument>) {}

  create(createFileDto: CreateFileDto) {
    const createdFile = this.filesModule.create(createFileDto);
    return createdFile;
  }

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: string) {
    return this.filesModule.findById(id).exec();
  }

  async updateFileName(id: string, updateFileDto: UpdateFileDto) {
    const file = await this.filesModule
    .findByIdAndUpdate(id, updateFileDto)
    .setOptions({ new: true })
    .populate('name')
    .populate('key')
    .populate('location');
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
