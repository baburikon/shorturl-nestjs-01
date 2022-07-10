import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
// import { Url } from './url.interface';

const nameSequence = 'url_seq';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private urlsRepository: Repository<Url>,
  ) {}

  async nextNumberFromSequence(): Promise<number> {
    const res = await this.urlsRepository.query(
      `SELECT nextval('${nameSequence}')`,
    );
    return res[0].nextval;
  }

  async findLongUrl(hashOfUrl: string): Promise<string | null> {
    const url = await this.urlsRepository.findOneByOrFail({ hashOfUrl });
    return url.longUrl;
  }

  async create({
    longUrl,
    hashOfUrl,
  }: {
    longUrl: string;
    hashOfUrl: string;
  }): Promise<Url> {
    const url = this.urlsRepository.create({
      longUrl,
      hashOfUrl,
    });
    return this.urlsRepository.save(url);
  }
}
