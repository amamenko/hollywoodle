export interface ActorObj {
  name: string;
  image: string;
  id: number;
  date: string;
  type: string;
  most_popular_recent_movie?: { [key: string]: string | number };
  most_popular_path?: { [key: string]: string | number };
  gender?: string;
}
