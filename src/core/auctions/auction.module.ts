import { Module } from '@nestjs/common';
import { AuctionsService } from '#src/core/auctions/auctions.service';
import { AuctionsController } from '#src/core/auctions/auctions.controller';
import { FilesModule } from '#src/core/files/files.module';
import { MosRuApiService } from '#src/core/mos-ru-api/mos-ru-api.service';
import { ResultsModule } from '#src/core/results/results.module';
import { MlApiService } from '#src/core/ml-api/ml-api.service';

@Module({
  imports: [FilesModule, ResultsModule],
  providers: [AuctionsService, MosRuApiService, MlApiService],
  controllers: [AuctionsController],
})
export class AuctionsModule {}
