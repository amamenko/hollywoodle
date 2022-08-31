import "dotenv/config";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { getTopPathsAggregatedData } from "./getTopPathsAggregatedData";

export const handleLiveChange = (
  change: { [key: string]: any },
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  key: string,
  connectionStr: string
) => {
  const logUpdate = () => {
    if (process.env.NODE_ENV === "production") {
      console.log(`Socket updated emitted: ${connectionStr}`);
    }
  };
  if (change.operationType === "update") {
    const allUpdatedFields = change.updateDescription.updatedFields;
    if (allUpdatedFields) {
      let changeData = allUpdatedFields[key];
      if (key === "paths") {
        const { totalPathsFound, totalPlayers, lowestDegree, highestDegree } =
          getTopPathsAggregatedData(changeData);
        socket.emit("pageCheck", (response: number | undefined) => {
          let currentPage = 0;
          if (response) currentPage = response;
          changeData = {
            // Only return 10 results at a time relative to current page
            paths: changeData.slice(currentPage * 10, currentPage * 10 + 10),
            totalPathsFound,
            totalPlayers,
            lowestDegree,
            highestDegree,
          };
          socket.emit("changeData", changeData);
          logUpdate();
        });
      }
      socket.emit("changeData", changeData);
      logUpdate();
    }
  }
};
