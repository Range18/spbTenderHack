import { Module } from '@nestjs/common';
import { AuctionsModule } from '#src/core/auctions/auction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '#src/common/database.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), AuctionsModule],
})
export class AppModule {}
