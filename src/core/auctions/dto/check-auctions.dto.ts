import { ApiProperty } from '@nestjs/swagger';

export class CheckAuctionsDto {
  @ApiProperty()
  urls: string[];

  @ApiProperty()
  criteria: number[];
}
