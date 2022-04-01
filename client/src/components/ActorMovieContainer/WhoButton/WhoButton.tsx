import { useContext, useEffect, useState } from "react";
import { Collapse } from "react-collapse";
import { Button } from "reactstrap";
import { AppContext } from "../../../App";
import { getHint } from "./getHint";
import ClipLoader from "react-spinners/ClipLoader";
import "./WhoButton.scss";

export const WhoButton = ({
  knownFor,
  gender,
  typeOfGuess,
  hintCollapsed,
  changeHintCollapsed,
}: {
  knownFor?: { [key: string]: string | number };
  gender?: string;
  typeOfGuess?: string;
  hintCollapsed?: boolean;
  changeHintCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    firstActor,
    lastActor,
    guesses,
    currentMoves,
    changeCurrentMoves,
    win,
    darkMode,
  } = useContext(AppContext);
  const [collapse, changeCollapse] = useState(false);
  const [currentHint, changeCurrentHint] = useState({
    name: "",
    gender: "",
    year: "",
    title: "",
    character: "",
  });

  const toggleCollapse = () => {
    if (!collapse && !win) {
      changeCollapse(true);
      changeCurrentMoves(currentMoves + 1);
      if (changeHintCollapsed) {
        changeHintCollapsed(true);
      }
    }
  };

  useEffect(() => {
    const fetchHint = async () => {
      if (typeOfGuess && firstActor && lastActor) {
        const hint = await getHint(guesses, typeOfGuess, firstActor, lastActor);

        if (hint) {
          changeCurrentHint({
            name: hint.name,
            gender: hint.gender,
            title: hint.title,
            year: hint.year,
            character: hint.character,
          });
        }
      }
    };

    if (hintCollapsed) {
      fetchHint();
    }
  }, [firstActor, lastActor, typeOfGuess, guesses, hintCollapsed]);

  useEffect(() => {
    if (hintCollapsed === false) {
      changeCollapse(false);
      changeCurrentHint({
        name: "",
        gender: "",
        title: "",
        year: "",
        character: "",
      });
    }
  }, [hintCollapsed]);

  if (!win) {
    return (
      <div className="who_button_container">
        {!collapse && (
          <p>
            Stuck? <b>(+1 move)</b>
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
            <h2>HINT</h2>
            {knownFor && gender ? (
              <span className="hint_content_container">
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
                Your total moves increased by <b className="incorrect">
                  1
                </b>{" "}
                move.
              </span>
            ) : currentHint.name ? (
              <span className="hint_content_container">
                <b>{currentHint.name}</b> also starred in the film{" "}
                <b>
                  {currentHint.title} ({currentHint.year})
                </b>
                .{" "}
                {currentHint.gender === "male"
                  ? "He"
                  : currentHint.gender === "female"
                  ? "She"
                  : "They"}{" "}
                {currentHint.name === currentHint.character
                  ? currentHint.gender === "male"
                    ? "played himself."
                    : currentHint.gender === "female"
                    ? "played herself."
                    : "played themselves."
                  : "played the character of "}
                {currentHint.name !== currentHint.character ? (
                  <b>"{currentHint.character}."</b>
                ) : (
                  ""
                )}
              </span>
            ) : (
              <ClipLoader color={darkMode ? "#fff" : "#000"} size={75} />
            )}
          </div>
        </Collapse>
      </div>
    );
  } else {
    return <></>;
  }
};
