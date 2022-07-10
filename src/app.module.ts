import { CacheModule, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { UrlsModule } from './urls/urls.module';
import { Url } from './urls/url.entity';

const conf = configuration();

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      // isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: conf.database.host,
      port: conf.database.port,
      username: conf.database.user,
      password: conf.database.password,
      database: conf.database.db,
      synchronize: false,
      logging: true,
      entities: [Url],
      subscribers: [],
      migrations: [],
    }),
    CacheModule.register({
      max: 10000, // maximum number of items in cache
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    UrlsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
