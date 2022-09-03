export const getTopPathsAggregatedData = (
  paths: {
    [key: string]: string | number;
  }[]
) => {
  if (paths) {
    const allDataObj: { [key: string]: number[] } = {
      counts: [],
      degrees: [],
    };

    for (const path of paths) {
      allDataObj.counts.push(Number(path.count));
      allDataObj.degrees.push(Number(path.degrees));
    }

    const totalPathsFound = paths.length;
    const totalPlayers = allDataObj.counts.reduce((a, b) => a + b, 0);
    const lowestDegree = Math.min(...allDataObj.degrees);
    const highestDegree = Math.max(...allDataObj.degrees);

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
