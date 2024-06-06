import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { GetAllParameters, Movies } from './movies.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Post('create')
  create(@Body() movie: Movies) {
    return this.movieService.create(movie);
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.movieService.findById(id);
  }

  @Put('update')
  update(@Body() movie: Movies) {
    return this.movieService.update(movie);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.movieService.remove(id);
  }

  @Get()
  getAll(@Query() params: GetAllParameters): Movies[] {
    return this.movieService.getAll(params);
  }
}
