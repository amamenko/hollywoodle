import { AiOutlineClose } from "react-icons/ai";
import Modal from "react-modal";
import { RemoveScroll } from "react-remove-scroll";
import "../Header/Header.scss";

export const IntroModal = ({
  showIntroModal,
  changeShowIntroModal,
}: {
  showIntroModal: boolean;
  changeShowIntroModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleCloseModal = () => {
    changeShowIntroModal(false);
  };

  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      paddingBottom: "2rem",
      outline: "none",
    },
    overlay: {
      background: "rgba(0, 0, 0, 0.85)",
      backdropFilter: "blur(3px)",
      zIndex: 999999999,
    },
  };

  return (
    <RemoveScroll enabled={showIntroModal}>
      <Modal
        isOpen={showIntroModal}
        onRequestClose={handleCloseModal}
        contentLabel="Statistics Modal"
        className="modal_container intro"
        shouldFocusAfterRender={false}
        style={customModalStyles}
      >
        <h2>HOW TO PLAY</h2>
        <button className="close_modal_button" onClick={handleCloseModal}>
          <AiOutlineClose size={20} color="#fff" />
        </button>
        <div>
          <p>
            Connect the two actors with films they starred in as few guesses as
            possible.
          </p>
          <p>
            The <b>LOWER</b> your total moves, the better.
          </p>
          <p>
            If you can’t guess it in one move, try to name a movie starring the
            first actor that contains a cast member who's made a different movie
            with the second actor.
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
              Stuck? Use a <b>HINT</b>. Hints will gain you <b>1</b> move but
              may save you moves later on.
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
          <p className="actor_pairing_disclaimer">
            <b>A new actor pairing will be available each day!</b>
          </p>
        </div>
      </Modal>
    </RemoveScroll>
  );
};
