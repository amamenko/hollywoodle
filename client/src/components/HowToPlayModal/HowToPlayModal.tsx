import React, { useState } from "react";
import Countdown from "react-countdown";
import { AiOutlineQuestionCircle, AiOutlineClose } from "react-icons/ai";
import { endOfDay } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";
import "./HowToPlayModal.scss";

export const HowToPlayModal = () => {
  const [displayModal, changeDisplayModal] = useState(false);
  const date = new Date();
  const formattedETDate = formatInTimeZone(
    date,
    "America/New_York",
    "yyyy-MM-dd HH:mm:ssXXX"
  );
  const parsedDate = toDate(formattedETDate, { timeZone: "America/New_York" });

  return (
    <>
      <AiOutlineQuestionCircle
        className="how_to_play_icon"
        color={"#fff"}
        size={25}
        onClick={() => changeDisplayModal(!displayModal)}
      />
      <div className={`how_to_play_modal ${displayModal ? "show" : ""}`}>
        <button
          className="close_modal_button"
          onClick={() => changeDisplayModal(!displayModal)}
        >
          <AiOutlineClose size={25} color="#fff" />
        </button>
        <h1 className="how_to_play_title">HOW TO PLAY</h1>
        <div className="how_to_play_text_container">
          <p>
            Each day we’ll give you two actors. The goal is to connect them with
            films they starred in as few guesses as possible, much like the{" "}
            <a
              href="https://en.wikipedia.org/wiki/Six_Degrees_of_Kevin_Bacon"
              target="_blank"
              rel="noopener noreferrer"
            >
              Six Degrees of Kevin Bacon.
            </a>
          </p>
          <p>
            The <b>LOWER</b> your total moves, the better.
          </p>
          <p>
            Think you can do it in one? If you can’t — that’s okay! Try to name
            a movie that the first actor was in that stars an actor who’s made a
            different movie with the second actor.
          </p>
          <p>
            That’s the way to do it: guess a movie, then an actor, then a movie
            until you’ve completed the chain and connected the two!
          </p>
          <ul className="how_to_play_list">
            <li>
              Any <b className="correct">CORRECT</b> guess will gain you{" "}
              <b>1</b> move.
            </li>
            <li>
              <b>HINTS</b> will also gain you <b>1</b> move but may save you
              moves later on.
            </li>
            <li>
              An <b className="incorrect">INCORRECT</b> guess will gain you{" "}
              <b>3</b> moves — so don’t type a movie the current actor wasn't in
              or an actor who wasn’t in the current movie!
            </li>
            <li>
              If you’re guessing movies and type something the goal actor was in
              but not the current actor, we’ll give you{" "}
              <b className="partial">PARTIAL CREDIT</b> — <b>2</b> moves. Not
              what we were looking for, but you know your movies!
            </li>
          </ul>
          <div className="next_pairing_countdown_container">
            <p>Next Hollywoodle actor pairing in:</p>
            <b>
              <Countdown
                date={endOfDay(parsedDate)}
                autoStart={true}
                daysInHours={true}
                onComplete={() => changeDisplayModal(false)}
              />
            </b>
          </div>
        </div>
      </div>
      <div
        className={`how_to_play_overlay ${displayModal ? "show" : ""}`}
        onClick={() => changeDisplayModal(!displayModal)}
      />
    </>
  );
};
