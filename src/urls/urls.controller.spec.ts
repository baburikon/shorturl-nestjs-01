import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CacheModule, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { Url } from './url.entity';

describe('UrlsController', () => {
  let urlsController: UrlsController;
  let numberFromSequence = 1000;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register(), ConfigModule],
      controllers: [UrlsController],
      providers: [
        UrlsService,
        {
          provide: getRepositoryToken(Url),
          useValue: {
            create: async () => ({
              hashOfUrl: 'ga123',
              longUrl: 'https://www.rabbitmq.com/',
            }),
            save: async () => ({
              id: 1,
              hashOfUrl: 'ga123',
              longUrl: 'https://www.rabbitmq.com/',
            }),
            findOneByOrFail: async () => ({
              longUrl: 'https://www.typescriptlang.org/',
            }),
            query: async () => [{ nextval: ++numberFromSequence }],
          },
        },
      ],
    }).compile();

    urlsController = app.get<UrlsController>(UrlsController);
  });

  describe('redirect', () => {
    it('with empty hashOfUrl should return undefined', async () => {
      expect(await urlsController.redirect()).toEqual(undefined);
    });
    it('with not empty hashOfUrl should return url and statusCode', async () => {
      expect(await urlsController.redirect('kj6')).toEqual({
        url: 'https://www.typescriptlang.org/',
        statusCode: HttpStatus.FOUND,
      });
    });
  });

  describe('shorten', () => {
    it('with empty hashOfUrl should return undefined', async () => {
      expect(await urlsController.redirect()).toEqual(undefined);
    });
  });
});
