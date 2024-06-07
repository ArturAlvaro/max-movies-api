import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetAllParameters, Movies } from './movies.dto';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from 'src/db/entities/movie.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>
  ) {}

  private movie: Movies[] = [];

  async create(movie: Movies) {
    const checkMovie = await this.movieRepository.findOne({
      where: { title: movie.title },
    });

    if (checkMovie) {
      throw new ConflictException(`Filme ${movie.title} já está cadastrado!`);
    }

    const createMovie = await this.movieRepository.save(movie);

    return createMovie;
  }

  async findById(id: string): Promise<Movies> {
    const foundMovie = await this.movieRepository.findOne({
      where: { id },
    });

    if (!foundMovie) {
      throw new NotFoundException(`Filme ${id} não encontrado!`);
    }

    return foundMovie;
  }

  async update(id: string, movie: Movies) {
    const foundMovie = await this.movieRepository.findOne({
      where: { id },
    });

    if (!foundMovie) {
      throw new BadRequestException(`Filme ${id} não encontrado!`);
    }

    await this.movieRepository.update(id, movie);

    const updated = await this.movieRepository.findOne({
      where: { id },
    });

    return updated;
  }

  async remove(id: string) {
    const result = await this.movieRepository.delete(id);

    if (!result.affected) {
      throw new BadRequestException(`Filme ${id} não encontrado!`);
    }
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
