import { MovieEntity } from '../db/entities/movie.entity';
import { v4 as uuid } from 'uuid';
import { MoviesController } from './movies.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const movieEntity: MovieEntity = {
  id: uuid(),
  title: 'Filme - O Teste',
  releaseYear: new Date('2024-06-20T23:33:00Z'),
  description: 'Teste',
  director: 'Diretor Teste',
  genre: 'Drama',
  imdbRating: 9.8,
  writers: 'Escritor Teste',
};

describe('MovieController', () => {
  let movieController: MoviesController;
  let movieService: MoviesService;
  let cacheManager: Cache;
  let movieRepository: Repository<MovieEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(MovieEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn().mockResolvedValue(movieEntity),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('jwt-secret'),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    cacheManager = module.get<Cache>(CACHE_MANAGER);
    movieService = module.get<MoviesService>(MoviesService);
    movieController = module.get<MoviesController>(MoviesController);
    movieRepository = module.get<Repository<MovieEntity>>(getRepositoryToken(MovieEntity));
  });

  it('Testa rota de criação de filme', () => {
    expect(movieController).toBeDefined();
    expect(movieService).toBeDefined();
  });

  it('Testa criação de filme', async () => {
    // act
    const result = await movieController.create(movieEntity);

    // assert
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('releaseYear');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('genre');
    expect(result).toHaveProperty('director');
    expect(result).toHaveProperty('imdbRating');
    expect(result).toHaveProperty('writers');
  });
});
