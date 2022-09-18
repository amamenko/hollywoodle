import { useContext, useEffect } from "react";
import { Collapse } from "react-collapse";
import { Button } from "reactstrap";
import { AppContext } from "../../../App";
import { Comments } from "../../../interfaces/Comments.interface";
import { Emotes } from "../../../interfaces/Emotes.interface";
// import { Comment } from "./Comment/Comment";
import { EmotesResults } from "./Like/EmotesResults";
import { Like } from "./Like/Like";

export const PathContainer = ({
  id,
  rank,
  degrees,
  count,
  path,
  emotes,
  comments,
  pathCollapsed,
  changePathCollapsed,
  currentPage,
}: {
  id: string;
  rank: number;
  degrees: number;
  count: number;
  path: string;
  emotes: Emotes;
  comments: Comments[];
  pathCollapsed: string;
  changePathCollapsed: React.Dispatch<React.SetStateAction<string>>;
  currentPage: number;
}) => {
  const { darkMode } = useContext(AppContext);
  useEffect(() => {
    return () => changePathCollapsed("");
  }, [changePathCollapsed]);

  const toggleCollapse = () => {
    if (!pathCollapsed) {
      changePathCollapsed(rank.toString());
    } else {
      if (pathCollapsed === rank.toString()) {
        changePathCollapsed("");
      } else {
        changePathCollapsed(rank.toString());
      }
    }
  };

  return (
    <div className={`individual_path_container ${darkMode ? "dark" : ""}`}>
      <div
        className={`${
          path ? "circle_and_numbers_container" : "circle_container"
        }`}
      >
        <div className="rank_circle">
          <p>{rank + currentPage * 10 + 1}</p>
        </div>
        {path && degrees && count ? (
          <div className="path_numbers_container">
            <p>
              <b>{degrees}</b> {degrees === 1 ? "degree" : "degrees"} of
              separation
            </p>
            <p>
              <b>{count}</b> {count === 1 ? "player" : "players"} played this
              path today
            </p>
          </div>
        ) : (
          ""
        )}
      </div>
      {path && degrees && count ? (
        <>
          <Button className={"who_button"} onClick={toggleCollapse}>
            {pathCollapsed === rank.toString() ? "HIDE" : "REVEAL"} PATH
          </Button>
          <Collapse
            isOpened={pathCollapsed === rank.toString()}
            initialStyle={{ height: 0, overflow: "hidden" }}
          >
            <div className={`collapse_container  ${darkMode ? "dark" : ""}`}>
              <p className="collapsed_path_full_info">{path}</p>
            </div>
          </Collapse>
        </>
      ) : (
        ""
      )}
      <EmotesResults
        pathCollapsed={pathCollapsed === rank.toString()}
        emotes={emotes}
      />
      <div className="bottom_path_reactions_container">
        <Like rank={rank} id={id} />
        {/* <Comment
          id={id}
          comments={comments}
          rank={rank}
          degrees={degrees}
          count={count}
          path={path}
        /> */}
      </div>
    </div>
  );
};
