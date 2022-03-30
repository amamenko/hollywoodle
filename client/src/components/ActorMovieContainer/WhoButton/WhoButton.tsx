import { useContext, useState } from "react";
import { Collapse } from "react-collapse";
import { Button } from "reactstrap";
import { AppContext } from "../../../App";
import "./WhoButton.scss";

export const WhoButton = ({
  knownFor,
  gender,
}: {
  knownFor: { [key: string]: string | number };
  gender: string;
}) => {
  const { currentMoves, changeCurrentMoves, win, darkMode } =
    useContext(AppContext);
  const [collapse, changeCollapse] = useState(false);

  const toggleCollapse = () => {
    if (!collapse && !win) {
      changeCollapse(true);
      changeCurrentMoves(currentMoves + 3);
    }
  };

  if (!win) {
    return (
      <div className="who_button_container">
        {!collapse && (
          <p>
            Stuck? <b>(+3 moves)</b>
          </p>
        )}
        <Button
          className={`who_button ${collapse ? "active" : ""}`}
          id="who_button"
          onClick={toggleCollapse}
        >
          GET A HINT
        </Button>
        <Collapse
          isOpened={collapse}
          initialStyle={{ height: 0, overflow: "hidden" }}
        >
          <div className={`collapse_container ${darkMode ? "dark" : ""}`}>
            <span>
              {gender === "male"
                ? "His"
                : gender === "female"
                ? "Her"
                : "Their"}{" "}
              most popular recent role was the character of{" "}
              <b>"{knownFor.character}"</b> in the <b>{knownFor.year}</b> film{" "}
              <b>{knownFor.title}</b>.
              <br />
              <br />
              You gained <b className="incorrect">3</b> moves.
            </span>
          </div>
        </Collapse>
      </div>
    );
  } else {
    return <></>;
  }
};
