export const getTopPathsAggregatedData = (
  paths: {
    [key: string]: string | number;
  }[]
) => {
  if (paths) {
    const allCounts = paths.map((el) => Number(el.count));
    const allDegrees = paths.map((el) => Number(el.degrees));

    const totalPathsFound = paths.length;
    const totalPlayers = allCounts.reduce((a, b) => a + b, 0);
    const lowestDegree = Math.min(...allDegrees);
    const highestDegree = Math.max(...allDegrees);

    return {
      totalPathsFound,
      totalPlayers,
      lowestDegree,
      highestDegree,
    };
  } else {
    return {
      totalPathsFound: 0,
      totalPlayers: 0,
      lowestDegree: 0,
      highestDegree: 0,
    };
  }
};
