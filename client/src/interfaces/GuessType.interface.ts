export interface GuessType {
  [key: string]:
    | string
    | number
    | boolean
    | number[]
    | {
        [key: string]: string | number;
      };
}
