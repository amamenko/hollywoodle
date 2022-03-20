import { useRef } from "react";
import Reward, { RewardElement } from "react-rewards";
import { ReactComponent as CrossRedCircle } from "../../assets/CrossRedCircle.svg";
import { ReactComponent as CircleCheckMark } from "../../assets/CircleCheckMark.svg";
import "./ActorMovieContainer.scss";

export const ActorMovieContainer = ({
  image,
  name,
  incorrect = undefined,
}: {
  image: string;
  name: string;
  incorrect?: boolean | undefined;
}) => {
  const rewardEl = useRef<RewardElement>(null);

  //   const throwPopcorn = () => {
  //     if (rewardEl.current) {
  //       rewardEl.current.rewardMe();
  //     }
  //   };

  return (
    <>
      {/* <Reward
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
      /> */}
      <div className="actor_movie_container">
        <div className="actor_movie_icon_container">
          {typeof incorrect === "boolean" ? (
            incorrect ? (
              <CrossRedCircle className="incorrect_icon" />
            ) : (
              <CircleCheckMark className="correct_icon" />
            )
          ) : (
            <></>
          )}
        </div>
        <img
          className={`actor_movie_image ${
            typeof incorrect === "boolean"
              ? incorrect
                ? "incorrect"
                : "correct"
              : ""
          }`}
          src={image}
          alt={name}
        ></img>
        <p className="actor_movie_name">{name}</p>
      </div>
    </>
  );
};
