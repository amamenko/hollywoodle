import { AiOutlineClose } from "react-icons/ai";
import Modal from "react-modal";
import { RemoveScroll } from "react-remove-scroll";
import KofiButton from "kofi-button";
import { toast } from "react-toastify";
import "./Header.scss";
import { useEffect } from "react";

export const customModalStyles = {
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

export const Support = ({
  showSupportModal,
  changeShowSupportModal,
}: {
  showSupportModal: boolean;
  changeShowSupportModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleCloseModal = () => {
    changeShowSupportModal(false);
  };

  // Remove all displayed toasts on modal open
  useEffect(() => {
    if (showSupportModal) toast.dismiss();
  }, [showSupportModal]);

  return (
    <RemoveScroll enabled={showSupportModal}>
      <Modal
        isOpen={showSupportModal}
        onRequestClose={handleCloseModal}
        contentLabel="Support Modal"
        className="modal_container  "
        shouldFocusAfterRender={false}
        style={customModalStyles}
      >
        <h2>SUPPORT HOLLYWOODLE</h2>
        <button className="close_modal_button" onClick={handleCloseModal}>
          <AiOutlineClose size={20} color="#fff" />
        </button>
        <p>
          If you enjoy playing the game, please consider supporting Hollywoodle.
        </p>
        <p>
          Hollywoodle is free to play and always will be! Every donation helps
          keep the website up and running.
        </p>
        <p>Thank you for visiting our site and supporting us.</p>
        <div className="kofi_button_container">
          <KofiButton
            color="#0a9396"
            title="Support us on Ko-fi"
            kofiID="H2H0BYJ1R"
          />
        </div>
      </Modal>
    </RemoveScroll>
  );
};
