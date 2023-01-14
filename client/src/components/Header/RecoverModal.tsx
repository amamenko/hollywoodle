import { useState } from "react";
import { Button } from "reactstrap";
import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";

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
  const [maxStreak, changeMaxStreak] = useState("");
  const [averageMoves, changeAverageMoves] = useState("");
  const setNewStatistics = () => {
    if (localStorage.getItem("hollywoodle-statistics")) {
      if (currentStreak || maxStreak || averageMoves) {
        const storageStr = localStorage.getItem("hollywoodle-statistics");
        let storageObj: {
          [key: string]: number | number[] | string | boolean;
        } = {};

        try {
          storageObj = JSON.parse(storageStr ? storageStr : "");
        } catch (e) {
          console.error(e);
        }

        const newCurrentStreak = Number(currentStreak);
        const newMaxStreak = Number(maxStreak);
        const newAvgMoves = Number(averageMoves) ? [Number(averageMoves)] : "";

        localStorage.setItem(
          "hollywoodle-statistics",
          JSON.stringify({
            ...storageObj,
            ...(newCurrentStreak && { current_streak: newCurrentStreak }),
            ...(newMaxStreak && { max_streak: newMaxStreak }),
            ...(newAvgMoves && { avg_moves: newAvgMoves }),
            last_recovered: storageObj.current_date,
          })
        );
      }
    }
    changeCurrentStreak("");
    changeMaxStreak("");
    changeAverageMoves("");
    handleToggleRecoverStatsModal();
  };
  return (
    <Modal
      isOpen={recoverStatsModalOpen}
      onRequestClose={handleToggleRecoverStatsModal}
      contentLabel="Recover Statistics Modal"
      className="modal_container reset_statistics_modal"
      shouldFocusAfterRender={false}
      style={customModalStyles}
    >
      <div className="reset_statistics_content_container recover_statistics_container">
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
        <div className="recover_stats_inputs_container">
          <div className={"contact_input_container recover_stats dark"}>
            <label htmlFor="current_streak">Current Streak</label>
            <input
              className="form-control recover_stats_input"
              type="number"
              name="current_streak"
              id="current_streak"
              aria-describedby="current_streak"
              min={0}
              max={999}
              onChange={(e) => {
                if (e.target.value === "0") {
                  changeCurrentStreak("");
                } else {
                  if (e.target.value.length < 4) {
                    changeCurrentStreak(e.target.value);
                  }
                }
              }}
              value={
                Number(currentStreak)
                  ? Number(currentStreak).toString()
                  : currentStreak
              }
            />
          </div>
          <div className={"contact_input_container recover_stats dark"}>
            <label htmlFor="max_streak">Max Streak</label>
            <input
              className="form-control recover_stats_input"
              type="number"
              name="max_streak"
              id="max_streak"
              aria-describedby="max_streak"
              min={0}
              max={999}
              onChange={(e) => {
                if (e.target.value === "0") {
                  changeMaxStreak("");
                } else {
                  if (e.target.value.length < 4) {
                    changeMaxStreak(e.target.value);
                  }
                }
              }}
              value={
                Number(maxStreak) ? Number(maxStreak).toString() : maxStreak
              }
            />
          </div>
          <div className={"contact_input_container recover_stats dark"}>
            <label htmlFor="average_moves">Average Moves</label>
            <input
              className="form-control recover_stats_input"
              type="number"
              name="average_moves"
              id="average_moves"
              aria-describedby="average_moves"
              min={0}
              max={999}
              onChange={(e) => {
                if (e.target.value === "0") {
                  changeAverageMoves("");
                } else {
                  if (e.target.value.length < 4) {
                    changeAverageMoves(e.target.value);
                  }
                }
              }}
              value={
                Number(averageMoves)
                  ? Number(averageMoves).toString()
                  : averageMoves
              }
            />
          </div>
        </div>
        <Button className={"who_button success"} onClick={setNewStatistics}>
          RECOVER STATS
        </Button>
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
