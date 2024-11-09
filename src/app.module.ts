import { Module } from '@nestjs/common';
import { AuctionsModule } from '#src/core/auctions/auction.module';

@Module({
  imports: [AuctionsModule],
})
export class AppModule {}
