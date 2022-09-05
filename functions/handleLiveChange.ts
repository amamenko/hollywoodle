import "dotenv/config";
import { getTopPathsAggregatedData } from "./getTopPathsAggregatedData";

export const handleLiveChange = (
  change: { [key: string]: any },
  socket: WebSocket,
  key: string
) => {
  if (change.operationType === "update") {
    const allUpdatedFields = change.updateDescription.updatedFields;
    if (allUpdatedFields) {
      let changeData = allUpdatedFields[key];
      if (key === "paths") {
        const { totalPathsFound, totalPlayers, lowestDegree, highestDegree } =
          getTopPathsAggregatedData(changeData);
        socket.send("pageCheck");
        socket.onmessage = (message) => {
          const messageData = message.data;
          let currentPage = 0;
          if (messageData) currentPage = Number(messageData);
          changeData = {
            // Only return 10 results at a time relative to current page
            paths: changeData.slice(currentPage * 10, currentPage * 10 + 10),
            totalPathsFound,
            totalPlayers,
            lowestDegree,
            highestDegree,
          };
          socket.send(
            JSON.stringify({ event: "pathsUpdate", data: changeData })
          );
        };
      }
    }
  }
};
