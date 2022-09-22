export const getStorageObj = () => {
  const storageStr = localStorage.getItem("hollywoodle-statistics");
  let storageObj: { [key: string]: number | number[] | string } = {};
  try {
    storageObj = JSON.parse(storageStr ? storageStr : "");
  } catch (e) {
    console.error(e);
  }
  return storageObj;
};
