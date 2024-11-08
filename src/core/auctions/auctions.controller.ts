import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsRightDto } from '#src/core/auctions/dto/is-right.dto';
import { AuctionsService } from '#src/core/auctions/auctions.service';

@ApiTags('Auctions')
@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  async checkIsRight(@Body() isRightDto: IsRightDto) {
    return await this.auctionsService.checkIsRight(isRightDto.url);
  }
}
