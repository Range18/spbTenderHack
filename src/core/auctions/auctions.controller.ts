import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckAuctionsDto } from '#src/core/auctions/dto/check-auctions.dto';
import { AuctionsService } from '#src/core/auctions/auctions.service';

@ApiTags('Auctions')
@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  async checkIsRight(@Body() isRightDto: CheckAuctionsDto) {
    return await this.auctionsService.checkAuctions(isRightDto);
  }
}
