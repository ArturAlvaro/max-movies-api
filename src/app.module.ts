import { Module, OnModuleInit } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './configs/app-options.constants';

@Module({
  imports: [
    CacheModule.registerAsync(RedisOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    MoviesModule,
    UsersModule,
    AuthModule,
    DbModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    console.log('Database Host:', this.configService.get<string>('DB_HOST'));
    console.log('Database Name:', this.configService.get<string>('DB_NAME'));
  }
}
