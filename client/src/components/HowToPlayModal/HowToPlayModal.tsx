import React, { useState } from "react";
import { AiOutlineQuestionCircle, AiOutlineClose } from "react-icons/ai";
import "./HowToPlayModal.scss";

export const HowToPlayModal = () => {
  const [displayModal, changeDisplayModal] = useState(false);

  return (
    <>
      <AiOutlineQuestionCircle
        className="how_to_play_icon"
        color={"#fff"}
        size={30}
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
            films they starred in as few guesses as possible.
          </p>
          <p>
            The <b>LOWER</b> your points, the better.
          </p>
          <p>
            Think you can do it in one? If you can’t — that’s okay! Hollywood’s
            a small town. Try to name a movie that the first actor was in that
            stars someone who’s made something with the second actor.
          </p>
          <p>
            That’s the way to do it: guess a movie, then an actor, then a movie
            until you’ve completed the chain and connected the two!
          </p>
          <ul className="how_to_play_list">
            <li>
              Any <b className="correct">CORRECT</b> guess will give you 10
              points.
            </li>
            <li>
              An <b className="incorrect">INCORRECT</b> guess will give you 30
              points — so don’t type a movie the current actor wasn't in or an
              actor who wasn’t in the current movie!
            </li>
            <li>
              If you’re guessing movies and type something the goal actor was in
              but not the current actor, we’ll give you{" "}
              <b className="partial">PARTIAL CREDIT</b> — 20 points. Not what we
              were looking for, but you know your movies!
            </li>
          </ul>
        </div>
      </div>
      <div
        className={`how_to_play_overlay ${displayModal ? "show" : ""}`}
        onClick={() => changeDisplayModal(!displayModal)}
      />
      <p className="Alert">{alert}</p>
    </>
  );
};
