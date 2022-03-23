export const getMostRecent = (
  arr: {
    [key: string]: string | number | boolean | number[];
  }[],
  type: string
) => {
  return arr.reverse().find((el) => el.type.toString() === type);
};
