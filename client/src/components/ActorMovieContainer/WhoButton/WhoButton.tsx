import { useContext, useEffect, useState } from "react";
import { Collapse } from "react-collapse";
import { Button } from "reactstrap";
import { AppContext } from "../../../App";
import { getHint } from "./getHint";
import ClipLoader from "react-spinners/ClipLoader";
import isMobile from "ismobilejs";
import Scroll from "react-scroll";
import "./WhoButton.scss";

export const WhoButton = ({
  knownFor,
  gender,
  typeOfGuess,
  hintCollapsed,
  changeHintCollapsed,
  firstHintClicked,
  changeFirstHintClicked,
}: {
  knownFor?: { [key: string]: string | number };
  gender?: string;
  typeOfGuess?: string;
  hintCollapsed?: boolean;
  changeHintCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
  firstHintClicked?: boolean;
  changeFirstHintClicked?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    firstActor,
    lastActor,
    guesses,
    currentMoves,
    changeCurrentMoves,
    win,
    darkMode,
    currentEmojiGrid,
    changeEmojiGrid,
    currentlyPlayingDate,
  } = useContext(AppContext);
  const currentIsMobile = isMobile();
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
      changeEmojiGrid([...currentEmojiGrid, "🟨"]);
      if (changeHintCollapsed) {
        changeHintCollapsed(true);
      }
      if (!firstHintClicked && changeFirstHintClicked) {
        changeFirstHintClicked(true);
      }
      if (firstHintClicked) {
        // Only scroll more on click on larger screens
        if (!currentIsMobile.any) {
          const scroll = Scroll.animateScroll;
          scroll.scrollMore(100);
        }
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
    if (!hintCollapsed || win) {
      changeCollapse(false);
      changeCurrentHint({
        name: "",
        gender: "",
        title: "",
        year: "",
        character: "",
      });

      if (changeFirstHintClicked) {
        changeFirstHintClicked(false);
      }
    }
  }, [hintCollapsed, win, changeFirstHintClicked, currentlyPlayingDate]);

  if (!win) {
    return (
      <div className="who_button_container">
        {!collapse && (
          <p>
            {firstHintClicked ? "Still" : ""} Stuck? <b>(+1 move)</b>
          </p>
        )}
        <Button
          className={`who_button ${collapse ? "active" : ""}`}
          id="who_button"
          onClick={toggleCollapse}
        >
          GET {firstHintClicked ? "ANOTHER" : "A"} HINT
        </Button>
        <Collapse
          isOpened={collapse}
          initialStyle={{ height: 0, overflow: "hidden" }}
        >
          <div className={`collapse_container ${darkMode ? "dark" : ""}`}>
            <h2>{firstHintClicked ? "ANOTHER HINT" : "HINT"}</h2>
            {knownFor && gender ? (
              firstHintClicked ? (
                <span className="hint_content_container">
                  One of{" "}
                  {gender === "male"
                    ? "his"
                    : gender === "female"
                    ? "her"
                    : "their"}{" "}
                  co-stars in{" "}
                  <b>
                    {knownFor.title} ({knownFor.year})
                  </b>{" "}
                  was <b>{knownFor.costarName}</b>, who played the role of{" "}
                  <b>"{knownFor.costarCharacter}."</b>
                  <br />
                  <br />
                  Your total moves increased by <b className="incorrect">
                    1
                  </b>{" "}
                  move.
                </span>
              ) : (
                // One of the most famous recent movies she's acted in is
                <span className="hint_content_container">
                  One of the most famous movies{" "}
                  {gender === "male"
                    ? "he's"
                    : gender === "female"
                    ? "she's"
                    : "they've"}{" "}
                  acted in is the <b>{knownFor.year}</b> film{" "}
                  <b>{knownFor.title}</b>
                  {knownFor.title.toString()[
                    knownFor.title.toString().length - 1
                  ] === "."
                    ? ""
                    : "."}{" "}
                  {gender === "male"
                    ? "He"
                    : gender === "female"
                    ? "She"
                    : "They"}{" "}
                  played the character of <b>"{knownFor.character}."</b>
                  <br />
                  <br />
                  Your total moves increased by <b className="incorrect">
                    1
                  </b>{" "}
                  move.
                </span>
              )
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
