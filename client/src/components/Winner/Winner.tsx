import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { ReactComponent as Oscar } from "../../assets/Oscar.svg";
import Dicaprio from "../../assets/Dicaprio.png";
import Cats from "../../assets/Cats.jpg";
import { RewardElement } from "react-rewards";
import { CountdownTimer } from "../Countdown/CountdownTimer";
import TwitterButton from "./ShareButtons/TwitterButton";
import CopyLinkButton from "./ShareButtons/CopyLinkButton";
import { sortAsc } from "../AutosuggestInput/AutosuggestInput";
import KofiButton from "kofi-button";
import { getOrdinalSuffix } from "./getOrdinalSuffix";
import { Button } from "reactstrap";
import "./ShareButtons/ShareButtons.scss";
import "./Winner.scss";

export interface FullRewardElement extends RewardElement {
  container?: HTMLElement;
}

export const Winner = React.forwardRef<FullRewardElement, any>((props, ref) => {
  const {
    currentMoves,
    firstActor,
    lastActor,
    darkMode,
    changeWin,
    guesses,
    changeGuesses,
    changeCurrentMoves,
    changeMostRecentActor,
    changeMostRecentMovie,
    currentEmojiGrid,
    changeEmojiGrid,
    currentDegrees,
    changeCurrentDegrees,
    pathRankCount,
    changePathRankCount,
    currentlyPlayingDate,
    objectiveCurrentDate,
    changeShowTopPathsModal,
  } = useContext(AppContext);
  const [lastClicked, changeLastClicked] = useState("");
  // Regular share link
  const [shareLinkClicked, changeShareLinkClicked] = useState(false);
  const [shareLinkAnimatingOut, changeShareLinkAnimatingOut] = useState(false);

  // Path share link
  const [pathShareLinkClicked, changePathShareLinkClicked] = useState(false);
  const [pathShareLinkAnimatingOut, changePathShareLinkAnimatingOut] =
    useState(false);

  const [finalEmojiGrid, changeFinalEmojiGrid] = useState("");
  const [finalPath, changeFinalPath] = useState("");

  useEffect(() => {
    let pathArr = [];
    pathArr.push(firstActor.name);
    const clonedGuesses = guesses.slice();
    const correctGuesses = clonedGuesses
      .sort(sortAsc)
      .filter((guess) => !guess.incorrect && guess.incorrect !== "partial");
    pathArr = [
      ...pathArr,
      ...correctGuesses.map((guess) =>
        guess.type === "movie" ? `${guess.guess} (${guess.year})` : guess.guess
      ),
    ];
    pathArr.push(lastActor.name);
    changeFinalPath(pathArr.join(" ➡️ "));
  }, [firstActor.name, guesses, lastActor.name]);

  useEffect(() => {
    const fillerEmoji = darkMode ? "⬛" : "⬜";

    let newArr = currentEmojiGrid.slice();
    const winEmoji = currentEmojiGrid[currentEmojiGrid.length - 1];
    const lastRow = `\n${winEmoji}${winEmoji}${winEmoji}${winEmoji}${winEmoji}`;
    newArr.pop();

    let counter = 0;
    for (let i = 0; i < newArr.length; i++) {
      counter++;
      if (counter === 6) {
        counter = 0;
        newArr.splice(i, 0, "\n");
      }
    }

    const onlyEmojiArr = newArr.filter((el) => el !== "\n");
    // Fill empty space with black emojis for formatting consistency
    if (onlyEmojiArr.length % 5 !== 0) {
      const lastNewLineIndex =
        newArr.lastIndexOf("\n") !== -1 ? newArr.lastIndexOf("\n") : 0;
      const lastLine = newArr
        .slice(lastNewLineIndex)
        .filter((el) => el !== "\n");
      while (lastLine.length < 5) {
        lastLine.push(fillerEmoji);
      }

      newArr.splice(lastNewLineIndex);
      newArr = [...newArr, "\n", ...lastLine];
    }
    changeFinalEmojiGrid(`${newArr.join("")}${lastRow}`);
  }, [currentEmojiGrid, darkMode]);

  const handleRetake = () => {
    window.scrollTo(0, 0);
    changeGuesses([]);
    changeMostRecentActor({ guess: "", type: "", year: "" });
    changeMostRecentMovie({ guess: "", type: "", year: "" });
    changeEmojiGrid([]);
    changeWin(false);
    changeCurrentMoves(0);
    changeCurrentDegrees(0);
    changePathRankCount({
      rank: "",
      count: "",
    });

    if (shareLinkClicked) {
      changeShareLinkClicked(false);
    }

    if (shareLinkAnimatingOut) {
      changeShareLinkAnimatingOut(false);
    }

    if (pathShareLinkClicked) {
      changePathShareLinkClicked(false);
    }

    if (pathShareLinkAnimatingOut) {
      changePathShareLinkAnimatingOut(false);
    }

    changeLastClicked("");
  };

  // Throw popcorn as soon as the winner component mounts
  useEffect(() => {
    if (ref && typeof ref === "object" && ref.current) {
      if (ref.current.container) {
        ref.current.container.style.width = "100%";
        ref.current.container.style.height = "100vh";
        ref.current.container.style.position = "fixed";
        ref.current.container.style.display = "flex";
        ref.current.container.style.alignItems = "center";
        ref.current.container.style.justifyContent = "center";
        ref.current.container.style.zIndex = "999999999";
        ref.current.container.style.overflow = "hidden";

        setTimeout(() => {
          if (ref.current && ref.current.container) {
            ref.current.container.style.display = "none";
          }
        }, 3500);
      }
      ref.current.rewardMe();
    }
  }, [ref]);

  useEffect(() => {
    const handleAnimateOutTimeout = (
      clickedFn: (value: React.SetStateAction<boolean>) => void,
      animatingOutFn: (value: React.SetStateAction<boolean>) => void
    ) => {
      setTimeout(() => {
        animatingOutFn(true);
      }, 4500);

      setTimeout(() => {
        clickedFn(false);
        animatingOutFn(false);
      }, 4800);
    };

    const resetOppositeCopyShareLink = (
      clickedFn: (value: React.SetStateAction<boolean>) => void,
      animatingOutFn: (value: React.SetStateAction<boolean>) => void
    ) => {
      clickedFn(false);
      animatingOutFn(false);
    };

    if (lastClicked === "link" && shareLinkClicked) {
      handleAnimateOutTimeout(
        changeShareLinkClicked,
        changeShareLinkAnimatingOut
      );
      resetOppositeCopyShareLink(
        changePathShareLinkClicked,
        changePathShareLinkAnimatingOut
      );
    } else {
      if (lastClicked === "path" && pathShareLinkClicked) {
        handleAnimateOutTimeout(
          changePathShareLinkClicked,
          changePathShareLinkAnimatingOut
        );
        resetOppositeCopyShareLink(
          changeShareLinkClicked,
          changeShareLinkAnimatingOut
        );
      }
    }
  }, [shareLinkClicked, pathShareLinkClicked, lastClicked]);

  const shareText = `I found ${currentDegrees} ${
    currentDegrees === 1 ? "degree" : "degrees"
  } of separation between ${firstActor.name} and ${
    lastActor.name
  } in ${currentMoves} ${
    currentMoves === 1 ? "move" : "moves"
  } on Hollywoodle.`;

  const pathShare = `My path was the ${
    getOrdinalSuffix(pathRankCount.rank) === "1st"
      ? "most"
      : `${getOrdinalSuffix(pathRankCount.rank)} most`
  } popular path chosen today — ${
    pathRankCount.count === "0"
      ? "I was the first player to play that path."
      : `${pathRankCount.count} other ${
          Number(pathRankCount.count) === 1 ? "player" : "players"
        } played the same path.`
  }`;

  const finalShareText = `${shareText}\n${finalEmojiGrid}\n${
    pathRankCount.rank && pathRankCount.count ? `\n${pathShare}\n` : ""
  }hollywoodle.ml`;

  return (
    <div className={`winner_container ${darkMode ? "dark" : ""}`}>
      <div className="winner_icon_container">
        {currentMoves > 10 ? (
          <img
            className="cats_poster"
            src={Cats}
            alt="The poster for the movie Cats (2019)"
          />
        ) : currentMoves >= 5 ? (
          <img
            src={Dicaprio}
            alt="Leonardo Dicaprio from The Great Gatsby (2013)"
          />
        ) : (
          <Oscar />
        )}
      </div>
      <h2>
        {currentMoves > 10 ? (
          <span>
            Oof — now that’s <br />
            💣 &nbsp;&nbsp;a box office bomb.&nbsp;&nbsp; 💣
          </span>
        ) : currentMoves >= 5 ? (
          <span>
            🍸 &nbsp;&nbsp;Well, it’s an honor&nbsp;&nbsp; 🍸
            <br /> just to be nominated.
          </span>
        ) : (
          <span>
            And the Oscar goes to...
            <br />
            🏆 &nbsp;&nbsp;you!&nbsp;&nbsp; 🏆
          </span>
        )}
      </h2>
      <p>
        You found <b>{currentDegrees}</b>{" "}
        {currentDegrees === 1 ? "degree" : "degrees"} of separation between{" "}
        <b>{firstActor.name}</b> and <b>{lastActor.name}</b>.
        <br />
        <br />
        You were able to connect them
        {currentMoves > 10 ? ", but it took you " : " in "}
        {currentMoves > 10 ? "a whopping" : currentMoves < 5 ? "only" : ""}{" "}
        <b>{currentMoves}</b>{" "}
        {currentMoves >= 5 ? "moves." : currentMoves === 1 ? "move!" : "moves!"}
      </p>{" "}
      <div className={`winner_countdown_container ${darkMode ? "dark" : ""}`}>
        {pathRankCount.rank && pathRankCount.count ? (
          <div
            className={`winner_path_information_container ${
              darkMode ? "dark" : ""
            }`}
          >
            <p>
              Your path was the{" "}
              {getOrdinalSuffix(pathRankCount.rank) === "1st" ? (
                <b>most</b>
              ) : (
                <span>
                  <b>{getOrdinalSuffix(pathRankCount.rank)}</b> most
                </span>
              )}{" "}
              popular path chosen today.{" "}
              {pathRankCount.count === "0" ? (
                <>
                  <br />
                  <br />
                  <span>
                    You were the <b>first</b> player to play that path today.
                  </span>
                </>
              ) : (
                <>
                  <br />
                  <br />
                  <span>
                    <b>{pathRankCount.count}</b> other{" "}
                    {Number(pathRankCount.count) === 1 ? "player" : "players"}{" "}
                    played the same path as you today.
                  </span>
                </>
              )}
            </p>
            {currentlyPlayingDate === objectiveCurrentDate ? (
              <Button
                className="who_button top_paths_button"
                onClick={() => changeShowTopPathsModal(true)}
              >
                VIEW ALL TODAY'S PATHS
              </Button>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
        <p>Next Hollywoodle actor pairing:</p>
        <b>
          <CountdownTimer />
        </b>
      </div>
      <div className="winner_kofi_button">
        <p>Loving Hollywoodle?</p>
        <KofiButton
          color="#0a9396"
          title="Support the creator on Ko-fi"
          kofiID="E1E3CFTNF"
        />
      </div>
      <div className={`winner_bottom ${darkMode ? "dark" : ""}`}>
        <p
          className={`play_again_link ${darkMode ? "dark" : ""}`}
          onClick={handleRetake}
        >
          Play Again
        </p>
        <ul
          className={`share_links_list ${darkMode ? "dark" : ""}`}
          aria-label="share"
        >
          <CopyLinkButton
            shareLinkClicked={shareLinkClicked}
            changeShareLinkClicked={changeShareLinkClicked}
            changeLastClicked={changeLastClicked}
            shareLinkAnimatingOut={shareLinkAnimatingOut}
            copyShareLink={`${finalShareText.trim()}`}
          />
          <CopyLinkButton
            shareLinkClicked={pathShareLinkClicked}
            changeShareLinkClicked={changePathShareLinkClicked}
            changeLastClicked={changeLastClicked}
            shareLinkAnimatingOut={pathShareLinkAnimatingOut}
            copyShareLink={finalPath}
            path={true}
          />
          <TwitterButton twitterShareText={finalShareText} />
        </ul>
      </div>
    </div>
  );
});
