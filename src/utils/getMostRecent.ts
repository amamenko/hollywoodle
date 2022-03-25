export const getMostRecent = (
  arr: {
    [key: string]:
      | string
      | number
      | number[]
      | boolean
      | { [key: string]: string | number };
  }[],
  type: string
) => {
  return arr.reverse().find((el) => el.type.toString() === type);
};
