import {
  Body,
  CACHE_MANAGER,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as base62 from 'base62/lib/ascii';
import { ConfigService } from '@nestjs/config';
import { UrlsService } from './urls.service';
import { ShortenDto } from './shorten.dto';

@Controller()
export class UrlsController {
  private readonly MAX_COUNT_OF_TRIES_CREATE: number;
  private readonly BASE_URL: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly urlsService: UrlsService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.BASE_URL = this.configService.get('baseUrl');
    this.MAX_COUNT_OF_TRIES_CREATE = this.configService.get(
      'maxCountOfTriesCreate',
    );
  }

  @Get(':hashOfUrl')
  @Redirect()
  async redirect(@Param('hashOfUrl') hashOfUrl?: string): Promise<any> {
    if (!hashOfUrl) return;
    const cachedLongUrl = await this.cacheManager.get(hashOfUrl);
    let longUrl;
    if (cachedLongUrl) {
      longUrl = cachedLongUrl;
    } else {
      try {
        longUrl = await this.urlsService.findLongUrl(hashOfUrl);
      } catch (e) {
        return e;
        throw new HttpException('URL not found by hash', HttpStatus.NOT_FOUND);
      }
      await this.cacheManager.set(hashOfUrl, longUrl, { ttl: 1000 });
    }
    return {
      url: longUrl,
      statusCode: HttpStatus.FOUND,
    };
  }

  @Post('api/v1/shorten')
  async shorten(@Body() shortenDto: ShortenDto) {
    const longUrl = shortenDto.longUrl;
    let hashOfUrl: string;
    const customHashOfUrl = shortenDto.customHashOfUrl;
    if (customHashOfUrl) {
      hashOfUrl = customHashOfUrl;
      try {
        await this.urlsService.create({
          longUrl,
          hashOfUrl,
        });
      } catch (e) {
        throw new HttpException('The hash is not unique', HttpStatus.CONFLICT);
      }
    } else {
      let notUnique = true;
      let countOfTriesCreate = 0;
      do {
        const nextNumber = await this.urlsService.nextNumberFromSequence();
        hashOfUrl = base62.encode(nextNumber);
        try {
          countOfTriesCreate++;
          await this.urlsService.create({
            longUrl,
            hashOfUrl,
          });
          notUnique = false;
        } catch (e) {
          // react to different types of errors in different ways
        }
      } while (
        notUnique &&
        countOfTriesCreate < this.MAX_COUNT_OF_TRIES_CREATE
      );
      if (notUnique) {
        throw new HttpException(
          `The hash is not unique ${countOfTriesCreate} times`,
          HttpStatus.CONFLICT,
        );
      }
    }

    const shortUrl = `${this.BASE_URL}${hashOfUrl}`;
    return {
      shortUrl,
    };
  }
}
