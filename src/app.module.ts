import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { S3Service } from './services/s3-service/s3.service';
import { UnsplashService } from './unsplash/unsplash.service';
import { UnsplashModule } from './unsplash/unsplash.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    FilesModule,
    UsersModule,
    UnsplashModule
  ],
  controllers: [AppController],
  providers: [AppService, S3Service, UnsplashService],
})
export class AppModule {}
