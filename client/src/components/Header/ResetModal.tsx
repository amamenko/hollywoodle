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

interface ResetModalProps {
  resetStatsModalOpen: boolean;
  handleToggleResetStatsModal: () => void;
  handleResetStatistics: () => void;
}

export const ResetModal = ({
  resetStatsModalOpen,
  handleToggleResetStatsModal,
  handleResetStatistics,
}: ResetModalProps) => {
  return (
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
        <Button className={"who_button"} onClick={handleToggleResetStatsModal}>
          GO BACK
        </Button>
      </div>
    </Modal>
  );
};
