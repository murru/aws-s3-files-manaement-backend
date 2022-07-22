import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema()
export class File {
  @Prop()
  name: string;

  @Prop()
  key: string;

  @Prop()
  location: string;
}

export const FileSchema = SchemaFactory.createForClass(File);