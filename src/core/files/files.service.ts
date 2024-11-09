import { FileForMlType } from '#src/core/files/types/file-for-ml.type';
import { Injectable } from '@nestjs/common';
import { MosRuApiService } from '#src/core/mos-ru-api/mos-ru-api.service';
import mammoth from 'mammoth';
import { AuctionFileRdo } from '#src/core/auctions/rdo/auction-file.rdo';
import { mainConfig } from '#src/common/configs/main.config';
import * as path from 'node:path';
import { getPDFJS } from '#src/common/utils/pdfjs-import';

@Injectable()
export class FilesService {
  constructor(private readonly mosRuApiService: MosRuApiService) {}

  async getFilesPayload(files: AuctionFileRdo[]): Promise<FileForMlType[]> {
    return await Promise.all(
      files.map(async (file) => await this.getFilePayload(file)),
    );
  }

  async getFilePayload(file: AuctionFileRdo): Promise<FileForMlType> {
    console.log(path.extname(file.name));
    switch (path.extname(file.name)) {
      case '.docx':
        return {
          id: file.id,
          filename: file.name,
          text: await this.parseDocx(file),
        };

      case '.pdf':
        return {
          id: file.id,
          filename: file.name,
          text: await this.parsePdf(file),
        };

      default:
        throw new Error('Unsupported file type');
    }
  }

  private async parseDocx(file: AuctionFileRdo) {
    const response = await this.mosRuApiService
      .getHttpClient()
      .get('/FileStorage/Download?id=' + file.id, {
        responseType: 'arraybuffer',
      });

    return (await mammoth.extractRawText({ buffer: response.data })).value;
  }

  private async parsePdf(file: AuctionFileRdo) {
    const pdf = await getPDFJS().getDocument(
      `${mainConfig.apiBaseUrl}/FileStorage/Download?id=${file.id}`,
    ).promise;

    const promises = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const text = await page.getTextContent();
      promises.push(text.items.map((s) => s['str']).join('\n'));
    }

    return Promise.all(promises).then(function (texts) {
      return texts.join('');
    });
  }
}
