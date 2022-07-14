import { Button } from "reactstrap";
import { Collapse } from "react-collapse";
import { useContext } from "react";
import { AppContext } from "../../../App";
import { ActorObj } from "../../../interfaces/ActorObj.interface";

export const ArchiveRevealPathButton = ({
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
  const { darkMode, currentlyPlayingDate } = useContext(AppContext);
  return (
    <>
      <div className="top_path_button_container">
        {
          <p
            className={`spoiler_warning ${darkMode ? "dark" : ""} ${
              pathOpened ? "open" : ""
            }`}
          >
            Spoilers ahead!
          </p>
        }
        <Button
          onClick={() => changePathOpened(!pathOpened)}
          className={`who_button btn btn-secondary dark ${
            currentArchiveDate === currentlyPlayingDate ? "disabled" : ""
          }`}
        >
          {pathOpened ? "HIDE" : "REVEAL"} TOP PATH
        </Button>
      </div>
      <Collapse
        isOpened={pathOpened}
        initialStyle={{ height: 0, overflow: "hidden" }}
      >
        <div
          className={`archived_collapse collapse_container ${
            darkMode ? "dark" : ""
          }`}
        >
          {pathOpened ? (
            <p className="collapsed_path_full_info">
              <span>
                {firstActorShown.most_popular_path?.degrees ||
                  lastActorShown.most_popular_path?.degrees}{" "}
                {firstActorShown.most_popular_path?.degrees === 1 ||
                lastActorShown.most_popular_path?.degrees === 1
                  ? "degree"
                  : "degrees"}{" "}
                of separation:
              </span>
              <br /> <br />
              {firstActorShown.most_popular_path?.path ||
                lastActorShown.most_popular_path?.path}
            </p>
          ) : (
            ""
          )}
        </div>
      </Collapse>
    </>
  );
};
