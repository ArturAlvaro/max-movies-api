import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetAllParameters, Movies } from './movies.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from '../db/entities/movie.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(movie: Movies) {
    const checkMovie = await this.cacheManager.get<string>(`movieTitle:${movie.title}`);

    if (checkMovie) {
      return JSON.parse(checkMovie as string);
    }

    const createMovie = await this.movieRepository.save(movie);
    await this.cacheManager.set(`movieId:${movie.id}`, JSON.stringify(movie));
    await this.cacheManager.set(`movieTitle:${movie.title}`, JSON.stringify(movie));

    return createMovie;
  }

  async findById(id: string): Promise<Movies> {
    const movieInCache = await this.cacheManager.get<string>(`movieId:${id}`);

    if (!movieInCache) {
      const foundMovie = await this.movieRepository.findOne({
        where: { id },
      });

      if (!foundMovie) {
        throw new NotFoundException(`Filme ${id} não encontrado!`);
      }

      return foundMovie;
    }

    return JSON.parse(movieInCache as string);
  }

  async update(id: string, movie: Movies) {
    if (movie.id) {
      throw new BadRequestException('Campo id não é permitido!');
    }

    const movieInCache = await this.cacheManager.get<string>(`movieId:${id}`);

    if (movieInCache) {
      let oldMovieTitle: string;
      oldMovieTitle = JSON.parse(movieInCache).title;

      await this.movieRepository.update(id, movie);

      await this.cacheManager.del(`movieId:${id}`);
      await this.cacheManager.set(`movieId:${id}`, JSON.stringify(movie));

      const cachedMovieByTitle = await this.cacheManager.get<string>(`movieTitle:${oldMovieTitle}`);
      if (cachedMovieByTitle) {
        await this.cacheManager.del(`movieTitle:${oldMovieTitle}`);
      }

      await this.cacheManager.set(`movieTitle:${movie.title}`, JSON.stringify(movie));

      const search = await this.cacheManager.get<string>(`movieId:${id}`);
      return JSON.parse(search as string);
    }

    const foundMovie = await this.movieRepository.findOne({
      where: { id },
    });

    if (!foundMovie) {
      throw new BadRequestException(`Filme ${id} não encontrado!`);
    }

    await this.movieRepository.update(id, movie);

    await this.cacheManager.del(`movieId:${id}`);
    await this.cacheManager.set(`movieId:${id}`, JSON.stringify(movie));

    const cachedMovieByTitle = await this.cacheManager.get<string>(
      `movieTitle:${foundMovie.title}`
    );

    if (cachedMovieByTitle) {
      await this.cacheManager.del(`movieTitle:${foundMovie.title}`);
    }

    await this.cacheManager.set(`movieTitle:${movie.title}`, JSON.stringify(movie));

    const res = await this.movieRepository.findOne({
      where: { id },
    });

    return res;
  }

  async remove(id: string) {
    const searchMovie = await this.movieRepository.findOne({
      where: { id },
    });

    const result = await this.movieRepository.delete(id);

    if (!result.affected || !searchMovie) {
      throw new BadRequestException(`Filme ${id} não encontrado!`);
    }

    await this.cacheManager.del(`movieId:${id}`);
    await this.cacheManager.del(`movieTitle:${searchMovie.title}`);

    return { message: 'Filme deletado com sucesso!' };
  }

  async getAll(params: GetAllParameters): Promise<Movies[]> {
    const searchParams: FindOptionsWhere<MovieEntity> = {};

    if (params.title) {
      searchParams.title = Like(`%${params.title}%`);
    }

    if (params.genre) {
      searchParams.genre = Like(`%${params.genre}%`);
    }

    const moviesFound = await this.movieRepository.find({
      where: searchParams,
    });

    return moviesFound;
  }
}
