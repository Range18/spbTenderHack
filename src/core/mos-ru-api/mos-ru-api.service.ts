import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { mainConfig } from '#src/common/configs/main.config';

@Injectable()
export class MosRuApiService {
  private readonly mosRuServiceInstance: AxiosInstance;

  constructor() {
    this.mosRuServiceInstance = axios.create({
      baseURL: mainConfig.apiBaseUrl,
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      },
    });
  }

  getHttpClient() {
    return this.mosRuServiceInstance;
  }
}
