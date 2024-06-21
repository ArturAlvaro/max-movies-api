import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MovieEntity } from './entities/movie.entity';
import { UserEntity } from './entities/user.entity';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const configService = new ConfigService();
const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: +configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [MovieEntity, UserEntity],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
dataSource
  .initialize()
  .then(() => {
    console.log(`Database ${configService.get<string>('DB_NAME')} connected`);
  })
  .catch((error) => console.error('Database connection error:', error));

export default new DataSource(dataSourceOptions);
