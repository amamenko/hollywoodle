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
            Think you’ve got what it takes to be a star of the silver screen?
          </p>
          <p>Prove to yourself and your friends that you’re a movie expert!</p>
          <p>
            Each day we’ll give you two actors. The goal is to connect them with
            films they starred in.
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
          <p>
            - Any <b className="correct">CORRECT</b> guess will give you 10
            points.
          </p>
          <p>
            - An <b className="incorrect">INCORRECT</b>guess will give you 30 —
            so don’t type a movie the current actor was in or an actor who
            wasn’t in the current movie!
          </p>
          <p>
            - If you’re guessing movies and type something the goal actor was in
            but not the current actor, we’ll give you{" "}
            <b className="partial">PARTIAL CREDIT</b> — 20 points. Not what we
            were looking for, but you know your movies!
          </p>
          <p>
            - The goal is to get as few points as possible. Try to beat your
            lowest score or share with your friends to prove that you’re a true
            movie expert!
          </p>
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
