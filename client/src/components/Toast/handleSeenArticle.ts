export const handleSeenArticle = () => {
  const storageStr = localStorage.getItem("hollywoodle-statistics");
  let storageObj: { [key: string]: number | number[] | string } = {};
  try {
    storageObj = JSON.parse(storageStr ? storageStr : "");
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(
    "hollywoodle-statistics",
    JSON.stringify({
      ...storageObj,
      seen_article: true,
    })
  );
};
