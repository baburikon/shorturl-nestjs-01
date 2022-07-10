import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { Url } from './url.entity';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule,
    TypeOrmModule.forFeature([Url]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'public'),
    }),
  ],
  providers: [UrlsService],
  controllers: [UrlsController],
})
export class UrlsModule {}
