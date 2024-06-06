import { Injectable, NotFoundException } from '@nestjs/common';
import { GetAllParameters, Movies } from './movies.dto';

@Injectable()
export class MoviesService {
  private movie: Movies[] = [];

  create(movie: Movies) {
    this.movie.push(movie);
    return movie;
  }

  findById(id: string): Movies {
    const foundMovie = this.movie.filter((mv) => mv.id === id);

    if (foundMovie.length) {
      return foundMovie[0];
    }

    throw new NotFoundException(`Filme ${id} não encontrado!`);
  }

  update(movie: Movies) {
    let movieIndex = this.movie.findIndex((m) => m.id === movie.id);

    if (movieIndex >= 0) {
      this.movie[movieIndex] = movie;
      return movie;
    }

    throw new NotFoundException(`Filme ${movie.id}  não encontrado`);
  }

  remove(id: string) {
    let movieIndex = this.movie.findIndex((m) => m.id === id);

    if (movieIndex >= 0) {
      this.movie.splice(movieIndex, 1);

      return { message: 'Filme deletado com sucesso!' };
    }

    throw new NotFoundException(`Filme ${id} não encontrado!`);
  }

  getAll(params: GetAllParameters): Movies[] {
    return this.movie.filter((m) => {
      let mov = true;

      if (params.title !== undefined && !m.title.includes(params.title)) {
        mov = false;
      }

      if (params.genre !== undefined && !m.genre.includes(params.genre)) {
        mov = false;
      }

      return mov;
    });
  }
}
