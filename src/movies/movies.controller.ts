import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { GetAllParameters, MovieRouteParameter, Movies } from './movies.dto';
import { MoviesService } from './movies.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createMoviesSwagger } from './swagger/create-movies.swagger';

@UseGuards(AuthGuard)
@Controller('movies')
@ApiTags('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Post('create')
  @ApiOperation({ summary: 'Cria um catálogo de filme' })
  @ApiResponse({
    status: 201,
    description: 'Filme registrado com sucesso',
    type: createMoviesSwagger,
  })
  async create(@Body() movie: Movies) {
    return this.movieService.create(movie);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Busca um filme por ID' })
  @ApiResponse({ status: 200, description: 'Busca filme por ID', type: createMoviesSwagger })
  @ApiResponse({
    status: 400,
    description: 'Filme não encontrado',
    schema: {
      example: {
        message: 'O formato do ID é inválido.',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Filme não encontrado',
    schema: {
      example: {
        message: 'Filme a27ebaa9-3153-4516-b520-e8b7d875213c não encontrado!',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
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
