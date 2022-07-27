import { Injectable } from '@nestjs/common';
import { CreateUnsplashDto } from './dto/create-unsplash.dto';
import { UpdateUnsplashDto } from './dto/update-unsplash.dto';
import isomorpicFetch from 'isomorphic-fetch';
import { createApi } from 'unsplash-js';

@Injectable()
export class UnsplashService {
  create(createUnsplashDto: CreateUnsplashDto) {
    return 'This action adds a new unsplash';
  }

  async listImages() {
    let data: Array<Object>;
    const api = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
      fetch: isomorpicFetch
    });

    await api.photos
      .list({ page: 1, perPage: 30 })
      .then(res => {
        data = res.response.results.map( meta => {
          const formatted = {
            id: meta.id,
            url: meta.urls.regular
          };

          return formatted;
        });
      })
      .catch(error => {
          console.log(error);
      });

    return data;
  }
}
