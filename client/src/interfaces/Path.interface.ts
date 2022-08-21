import { Emotes } from "./Emotes.interface";

export interface Path {
  _id: string;
  degrees: number;
  count: number;
  path: string;
  emotes: Emotes;
}
