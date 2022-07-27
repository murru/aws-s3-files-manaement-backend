import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UnsplashDocument = Unsplash & Document;

@Schema()
export class Unsplash {
  @Prop()
  url: string;

}

export const UnsplashSchema = SchemaFactory.createForClass(Unsplash);