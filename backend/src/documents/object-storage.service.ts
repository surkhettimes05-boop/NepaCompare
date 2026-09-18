import { Injectable } from '@nestjs/common';

export type ObjectUploadResult = {
  key: string;
  url: string;
};

@Injectable()
export class ObjectStorageService {
  async putObject(_bucket: string, key: string, _body: Buffer | Uint8Array | string, _contentType?: string): Promise<ObjectUploadResult> {
    return {
      key,
      url: `https://storage.example.invalid/${key}`,
    };
  }

  async getSignedUrl(_bucket: string, key: string): Promise<string> {
    return `https://storage.example.invalid/private/${key}?sig=demo`;
  }

  async deleteObject(_bucket: string, _key: string): Promise<void> {
    return;
  }
}
