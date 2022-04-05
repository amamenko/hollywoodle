import { ReactComponent as CrossRedCircle } from "../../assets/CrossRedCircle.svg";
import { ReactComponent as CircleCheckMark } from "../../assets/CircleCheckMark.svg";
import { ReactComponent as PartialCredit } from "../../assets/PartialCredit.svg";
import { WhoButton } from "./WhoButton/WhoButton";
import "./ActorMovieContainer.scss";
import { useState } from "react";

export const ActorMovieContainer = ({
  image,
  name,
  incorrect = undefined,
  knownFor,
  gender,
  lastActor,
}: {
  image: string;
  name: string;
  incorrect?: boolean | string | undefined;
  knownFor?: { [key: string]: string | number };
  gender?: string;
  lastActor?: boolean;
}) => {
  const [firstHintClicked, changeFirstHintClicked] = useState(false);
  return (
    <>
      <div className="actor_movie_container">
        <div className="actor_movie_icon_container">
          {typeof incorrect === "boolean" || typeof incorrect === "string" ? (
            incorrect === "partial" ? (
              <PartialCredit className="partial_credit_icon" />
            ) : incorrect ? (
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
            typeof incorrect === "boolean" || typeof incorrect === "string"
              ? incorrect === "partial"
                ? "partial"
                : incorrect
                ? "incorrect"
                : "correct"
              : ""
          }`}
          src={image}
          alt={name}
        />
        <p className="actor_movie_name">{name}</p>
        {knownFor && gender && (
          <WhoButton
            knownFor={knownFor}
            gender={gender}
            changeFirstHintClicked={changeFirstHintClicked}
          />
        )}
        {knownFor && knownFor.costarName && lastActor && firstHintClicked && (
          <WhoButton
            knownFor={knownFor}
            gender={gender}
            firstHintClicked={firstHintClicked}
          />
        )}
      </div>
    </>
  );
};
