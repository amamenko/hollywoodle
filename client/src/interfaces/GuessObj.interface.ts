export interface GuessObj {
  [key: string]:
    | string
    | number
    | number[]
    | boolean
    | { [key: string]: string | number };
}
