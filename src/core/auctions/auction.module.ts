import { Module } from '@nestjs/common';
import { AuctionsService } from '#src/core/auctions/auctions.service';
import { AuctionsController } from '#src/core/auctions/auctions.controller';

@Module({ providers: [AuctionsService], controllers: [AuctionsController] })
export class AuctionsModule {}
