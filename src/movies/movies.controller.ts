import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { GetAllParameters, MovieRouteParameter, Movies } from './movies.dto';
import { MoviesService } from './movies.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Post('create')
  async create(@Body() movie: Movies) {
    return this.movieService.create(movie);
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.movieService.findById(id);
  }

  @Put('update/:id')
  async update(@Body() movie: Movies, @Param() params: MovieRouteParameter) {
    return this.movieService.update(params.id, movie);
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return this.movieService.remove(id);
  }

  @Get()
  async getAll(@Query() params: GetAllParameters): Promise<Movies[]> {
    return this.movieService.getAll(params);
  }
}
