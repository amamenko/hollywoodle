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
  const { currentPoints, guesses, firstActor, lastActor, darkMode } =
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
      }
      ref.current.rewardMe();
    }
  }, [ref]);

  return (
    <div className={`winner_container ${darkMode ? "dark" : ""}`}>
      <div className="winner_icon_container">
        {currentPoints >= 100 ? (
          <img
            className="cats_poster"
            src={Cats}
            alt="The poster for the movie Cats (2019)"
          />
        ) : currentPoints >= 50 ? (
          <img
            src={Dicaprio}
            alt="Leonardo Dicaprio from The Great Gatsby (2013)"
          />
        ) : (
          <Oscar />
        )}
      </div>
      <h2>
        {currentPoints >= 100 ? (
          <span>
            Oof — now that’s <br />
            💣 a box office bomb. 💣
          </span>
        ) : currentPoints >= 50 ? (
          <span>
            🍸 Well, it’s an honor 🍸
            <br /> just to be nominated.
          </span>
        ) : (
          <span>
            And the Oscar goes to...
            <br />
            🏆 you! 🏆
          </span>
        )}
      </h2>
      <p>
        You were able to connect <b>{firstActor.name}</b> to{" "}
        <b>{lastActor.name}</b>
        {currentPoints >= 100 ? ", but it took you " : " in "}
        <b>{guesses.length}</b> moves —{" "}
        {currentPoints >= 100
          ? `racking up a whopping`
          : currentPoints >= 50
          ? `you got`
          : `only`}{" "}
        <b>{currentPoints}</b>{" "}
        {currentPoints >= 100
          ? `points in the process.`
          : currentPoints >= 50
          ? "points."
          : "points!"}
      </p>
    </div>
  );
});
