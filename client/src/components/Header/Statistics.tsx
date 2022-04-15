import { useEffect, useState } from "react";
import { CountdownTimer } from "../Countdown/CountdownTimer";
import { AiOutlineClose } from "react-icons/ai";
import Modal from "react-modal";
import { ReactComponent as ComingSoon } from "../../assets/ComingSoon.svg";
import { RemoveScroll } from "react-remove-scroll";
import { Button } from "reactstrap";
import { format } from "date-fns-tz";
import { toast } from "react-toastify";

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

export const Statistics = ({
  modalOpen,
  closeModal,
}: {
  modalOpen: boolean;
  closeModal: () => void;
}) => {
  const [currentStreak, changeCurrentStreak] = useState(0);
  const [maxStreak, changeMaxStreak] = useState(0);
  const [averageMoves, changeAverageMoves] = useState<number[]>([]);
  const [resetStatsModalOpen, changeResetStatsModalOpen] = useState(false);

  let storageObj: { [key: string]: number | number[] } = {};

  if (localStorage.getItem("hollywoodle-statistics")) {
    const storageStr = localStorage.getItem("hollywoodle-statistics");

    try {
      storageObj = JSON.parse(storageStr ? storageStr : "");
    } catch (e) {
      console.error(e);
    }
  }

  // Remove all displayed toasts on modal open
  useEffect(() => {
    if (modalOpen) toast.dismiss();
  }, [modalOpen]);

  useEffect(() => {
    if (
      storageObj.current_streak &&
      currentStreak !== storageObj.current_streak
    )
      changeCurrentStreak(Number(storageObj.current_streak));
  }, [currentStreak, storageObj.current_streak]);

  useEffect(() => {
    if (storageObj.max_streak && maxStreak !== storageObj.max_streak)
      changeMaxStreak(Number(storageObj.max_streak));
  }, [maxStreak, storageObj.max_streak]);

  useEffect(() => {
    if (
      storageObj.avg_moves &&
      Array.isArray(storageObj.avg_moves) &&
      storageObj.avg_moves.length !== averageMoves.length
    )
      changeAverageMoves(storageObj.avg_moves);
  }, [storageObj.avg_moves, averageMoves.length]);

  Modal.setAppElement("#root");

  let measureAverageMoves =
    Math.round(averageMoves.reduce((a, b) => a + b, 0) / averageMoves.length) ||
    0;

  const handleToggleResetStatsModal = () => {
    changeResetStatsModalOpen(!resetStatsModalOpen);
  };

  const handleResetStatistics = () => {
    measureAverageMoves = 0;
    changeAverageMoves([]);
    changeCurrentStreak(0);
    changeMaxStreak(0);
    const currentDate = format(new Date(), "MM/dd/yyyy", {
      timeZone: "America/New_York",
    });

    localStorage.setItem(
      "hollywoodle-statistics",
      JSON.stringify({
        current_date: currentDate,
        last_played: "",
        current_streak: 0,
        max_streak: 0,
        avg_moves: [],
        played_today: false,
      })
    );

    handleToggleResetStatsModal();
  };

  return (
    <RemoveScroll enabled={modalOpen}>
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Statistics Modal"
        className="modal_container"
        shouldFocusAfterRender={false}
        style={customModalStyles}
      >
        <h2>STATISTICS</h2>
        <button className="close_modal_button" onClick={closeModal}>
          <AiOutlineClose size={20} color="#fff" />
        </button>
        <div className="statistics_outer_container">
          {" "}
          <div className="statistics_inner_container">
            <h3>{currentStreak}</h3>
            <div className="statistics_label">Current Streak</div>
          </div>
          <div className="statistics_inner_container">
            <h3>{maxStreak}</h3>
            <div className="statistics_label">Max Streak</div>
          </div>
          <div className="statistics_inner_container">
            <h3>{measureAverageMoves}</h3>
            <div className="statistics_label">Average Moves</div>
          </div>
          <div className="statistics_inner_container grayed_out">
            <ComingSoon className="coming_soon_banner" />
            <h3>0</h3>
            <div className="statistics_label">Leaderboard Placements</div>
          </div>
        </div>
        <div className="modal_statistics_countdown">
          <h2>NEXT HOLLYWOODLE</h2>
          <CountdownTimer />
        </div>
        <div className="statistics_time_disclaimer">
          <p>Until 12:00 AM Eastern Time (GMT-4),</p>
          <p>11:00 PM Central Daylight Time (GMT-5),</p>
          <p>9:00 PM Pacific Daylight Time (GMT-7)</p>
        </div>
        <div
          className="reset_statistics_container"
          onClick={handleToggleResetStatsModal}
        >
          <p>Reset Statistics</p>
        </div>
        <Modal
          isOpen={resetStatsModalOpen}
          onRequestClose={handleToggleResetStatsModal}
          contentLabel="Reset Statistics Modal"
          className="modal_container reset_statistics_modal"
          shouldFocusAfterRender={false}
          style={customModalStyles}
        >
          <div className="reset_statistics_content_container">
            <button
              className="close_modal_button"
              onClick={handleToggleResetStatsModal}
            >
              <AiOutlineClose size={20} color="#fff" />
            </button>
            <p>Are you sure you want to reset your Hollywoodle statistics?</p>
            <Button className={"who_button"} onClick={handleResetStatistics}>
              RESET STATISTICS
            </Button>
            <Button
              className={"who_button"}
              onClick={handleToggleResetStatsModal}
            >
              GO BACK
            </Button>
          </div>
        </Modal>
      </Modal>
    </RemoveScroll>
  );
};
