import { Injectable, Req, Res } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
    constructor() {}
    async uploadFile(dataBuffer: Buffer, filename: string) {
      const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
      const s3 = new S3();
      // ACL: 'public-read',
      const uploadResult = await s3.upload({
        Bucket: AWS_S3_BUCKET,
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
        .promise();
      
      return uploadResult;
    }

    downloadFile(key: string) {
      const s3 = new S3(); 
      const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
      const stream = s3.getObject({
        Bucket: AWS_S3_BUCKET,
        Key: key
      })
        .createReadStream();
      return {
        stream
      };
    }

    async generateLink(key: string) {
      const s3 = new S3(); 
      const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
      const signedUrl = s3.getSignedUrl("getObject", {
        Key: key,
        Bucket: AWS_S3_BUCKET,
        Expires: 60
      });
    
      return signedUrl;
    }
}
