import axios, { AxiosInstance } from 'axios';
import { HttpStatus, NotFoundException } from '@nestjs/common';

export class AuctionsService {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: 'https://zakupki.mos.ru' });
  }

  async checkIsRight(url: string) {
    const auctionId = this.parseAuctionId(url);

    const auctionResponse = await this.axiosInstance.get(
      '/newapi/api/Auction/Get?auctionId=' + auctionId,
    );

    if (
      !auctionResponse.data ||
      auctionResponse.status == HttpStatus.NOT_FOUND
    ) {
      throw new NotFoundException();
    }

    return auctionResponse.data;
  }

  private parseAuctionId(url: string) {
    return url.slice(url.lastIndexOf('/') + 1);
  }
}
