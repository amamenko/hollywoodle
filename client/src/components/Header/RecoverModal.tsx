import { Button } from "reactstrap";
import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";

const customModalStyles = {
  content: {
    top: "46%",
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

interface RecoverModalProps {
  recoverStatsModalOpen: boolean;
  handleToggleRecoverStatsModal: () => void;
}

export const RecoverModal = ({
  recoverStatsModalOpen,
  handleToggleRecoverStatsModal,
}: RecoverModalProps) => {
  const [currentStreak, changeCurrentStreak] = useState("");
  return (
    <Modal
      isOpen={recoverStatsModalOpen}
      onRequestClose={handleToggleRecoverStatsModal}
      contentLabel="Recover Statistics Modal"
      className="modal_container reset_statistics_modal"
      shouldFocusAfterRender={false}
      style={customModalStyles}
    >
      <div className="reset_statistics_content_container">
        <button
          className="close_modal_button"
          onClick={handleToggleRecoverStatsModal}
        >
          <AiOutlineClose size={20} color="#fff" />
        </button>
        <p>
          Lost your Hollywoodle stats? <br />
          No worries, recover them below!
        </p>
        <div className={`contact_input_container dark`}>
          <label htmlFor="current_streak">Current Streak</label>
          <input
            className="form-control"
            type="number"
            name="current_streak"
            id="current_streak"
            aria-describedby="text"
            maxLength={4}
            max={999}
            onChange={(e) => changeCurrentStreak(e.target.value)}
            value={
              Number(currentStreak)
                ? Number(currentStreak).toString()
                : currentStreak
            }
          />
        </div>
        <div className={`contact_input_container dark`}>
          <label htmlFor="current_streak">Max Streak</label>
          <input
            className="form-control"
            type="text"
            name="current_streak"
            id="current_streak"
            aria-describedby="text"
            maxLength={150}
            onChange={(e) => changeCurrentStreak(e.target.value)}
            value={currentStreak}
          />
        </div>
        <div className={`contact_input_container dark`}>
          <label htmlFor="current_streak">Average Moves</label>
          <input
            className="form-control"
            type="text"
            name="current_streak"
            id="current_streak"
            aria-describedby="text"
            maxLength={150}
            onChange={(e) => changeCurrentStreak(e.target.value)}
            value={currentStreak}
          />
        </div>
        {/* <Button className={"who_button"} onClick={handleResetStatistics}>
          RECOVER STATISTICS
        </Button> */}
        <Button
          className={"who_button"}
          onClick={handleToggleRecoverStatsModal}
        >
          GO BACK
        </Button>
      </div>
    </Modal>
  );
};
