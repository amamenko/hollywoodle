import React, { useContext, useEffect, useRef } from "react";
import { AppContext } from "../../App";
import { ReactComponent as Oscar } from "../../assets/Oscar.svg";
import Dicaprio from "../../assets/Dicaprio.png";
import Cats from "../../assets/Cats.jpg";
import Reward, { RewardElement } from "react-rewards";
import "./Winner.scss";

export const Winner = () => {
  const { currentPoints, guesses, firstActor, lastActor } =
    useContext(AppContext);

  const rewardEl = useRef<RewardElement>(null);

  const throwPopcorn = () => {
    if (rewardEl.current) {
      rewardEl.current.rewardMe();
    }
  };

  // Throw popcorn as soon as the winner component mounts
  useEffect(() => {
    throwPopcorn();
  }, []);

  return (
    <Reward
      ref={rewardEl}
      type="emoji"
      config={{
        emoji: ["🍿"],
        lifetime: 3000,
        zIndex: 9999,
        elementSize: 75,
        spread: 1000,
        springAnimation: false,
      }}
    >
      <div className="winner_container">
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
    </Reward>
  );
};
