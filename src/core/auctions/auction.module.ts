import { Module } from '@nestjs/common';
import { AuctionsService } from '#src/core/auctions/auctions.service';
import { AuctionsController } from '#src/core/auctions/auctions.controller';
import { FilesModule } from '#src/core/files/files.module';
import { MosRuApiService } from '#src/core/mos-ru-api/mos-ru-api.service';

@Module({
  imports: [FilesModule],
  providers: [AuctionsService, MosRuApiService],
  controllers: [AuctionsController],
})
export class AuctionsModule {}
