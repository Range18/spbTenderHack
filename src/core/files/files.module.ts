import { Module } from '@nestjs/common';
import { FilesService } from '#src/core/files/files.service';
import { MosRuApiService } from '#src/core/mos-ru-api/mos-ru-api.service';

@Module({ providers: [FilesService, MosRuApiService], exports: [FilesService] })
export class FilesModule {}
