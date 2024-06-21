import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { MovieEntity } from './entities/movie.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const dbName = configService.get<string>('DB_NAME');
        console.log(`Connecting to database: ${dbName}`);

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: +configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [UserEntity, MovieEntity],
          migrations: [__dirname + '/migrations/*.ts'],
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DbModule {}
