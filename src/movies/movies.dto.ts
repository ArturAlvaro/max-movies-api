export class Movies {
  id: string;
  title: string;
  releaseYear: Date;
  description: string;
  genre: string;
  imdbRating: number;
  director: string;
  writers: string;
}

export interface GetAllParameters {
  title: string;
  genre: string;
}
