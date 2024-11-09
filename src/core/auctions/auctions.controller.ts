import { Body, Controller, Post } from '@nestjs/common';
import { CheckAuctionsDto } from '#src/core/auctions/dto/check-auctions.dto';
import { AuctionsService } from '#src/core/auctions/auctions.service';
import { GetAuctionDocsDto } from '#src/core/auctions/dto/get-auction-docs.dto';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post('/check')
  async checkAuctions(@Body() checkAuctionsDto: CheckAuctionsDto) {
    return await this.auctionsService.checkAuctions(checkAuctionsDto);
  }

  @Post('/docs')
  async getAuctionDocs(@Body() getAuctionDocsDto: GetAuctionDocsDto) {
    return await this.auctionsService.getDocs(getAuctionDocsDto.url);
  }
}
