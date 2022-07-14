import { useContext } from "react";
import { AppContext } from "../../../App";
import { ActorObj } from "../../../interfaces/ActorObj.interface";
import { ArchivePlayButton } from "./ArchivePlayButton";
import { ArchiveRevealPathButton } from "./ArchiveRevealPathButton";

export const ArchiveButtons = ({
  pathOpened,
  changePathOpened,
  currentArchiveDate,
  firstActorShown,
  lastActorShown,
}: {
  pathOpened: boolean;
  changePathOpened: React.Dispatch<React.SetStateAction<boolean>>;
  currentArchiveDate: string;
  firstActorShown: ActorObj;
  lastActorShown: ActorObj;
}) => {
  const { objectiveCurrentDate } = useContext(AppContext);
  return (
    <div className="archived_buttons_container">
      <ArchivePlayButton
        currentArchiveDate={currentArchiveDate}
        changePathOpened={changePathOpened}
        firstActorShown={firstActorShown}
        lastActorShown={lastActorShown}
      />
      {firstActorShown.most_popular_path?.degrees ||
      lastActorShown.most_popular_path?.degrees ? (
        currentArchiveDate !== objectiveCurrentDate ? (
          <ArchiveRevealPathButton
            pathOpened={pathOpened}
            changePathOpened={changePathOpened}
            currentArchiveDate={currentArchiveDate}
            firstActorShown={firstActorShown}
            lastActorShown={lastActorShown}
          />
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </div>
  );
};
