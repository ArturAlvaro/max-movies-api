import { Client } from 'pg';
import { ConfigService } from '@nestjs/config';
import { config as dotEnvConfig } from 'dotenv';

dotEnvConfig({ path: '.env.test' });

const configService = new ConfigService();

async function createTestDatabase() {
  const client = new Client({
    host: configService.get<string>('DB_HOST'),
    port: +configService.get<number>('DB_PORT'),
    user: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
  });

  try {
    await client.connect();
    await client.query(`CREATE DATABASE "test_max-movies-api";`);
    console.log('Database "test_max-movies-api" created successfully');
  } catch (error) {
    if (error.code === '42P04') {
      console.log('Database "test_max-movies-api" already exists');
    } else {
      console.error('Failed to create database "test_max-movies-api"', error);
    }
  } finally {
    await client.end();
  }
}

createTestDatabase();
