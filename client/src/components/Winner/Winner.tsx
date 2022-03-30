import React, { useContext, useEffect } from "react";
import { AppContext } from "../../App";
import { ReactComponent as Oscar } from "../../assets/Oscar.svg";
import Dicaprio from "../../assets/Dicaprio.png";
import Cats from "../../assets/Cats.jpg";
import { RewardElement } from "react-rewards";
import "./Winner.scss";

export interface FullRewardElement extends RewardElement {
  container?: HTMLElement;
}

export const Winner = React.forwardRef<FullRewardElement, any>((props, ref) => {
  const { currentMoves, firstActor, lastActor, darkMode } =
    useContext(AppContext);

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
        You were able to connect <b>{firstActor.name}</b> to{" "}
        <b>{lastActor.name}</b>
        {currentMoves > 10 ? ", but it took you " : " in "}
        {currentMoves > 10 ? "a whopping" : currentMoves < 5 ? "only" : ""}{" "}
        <b>{currentMoves}</b>{" "}
        {currentMoves >= 5 ? "moves." : currentMoves === 1 ? "move!" : "moves!"}
      </p>
    </div>
  );
});
