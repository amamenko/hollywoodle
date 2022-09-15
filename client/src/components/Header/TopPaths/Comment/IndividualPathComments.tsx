import { AiOutlineClose } from "react-icons/ai";
import Modal from "react-modal";
import { RemoveScroll } from "react-remove-scroll";
// import { Button } from "reactstrap";
import "./Comment.scss";
import { IndividualComment } from "./IndividualComment";

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

export const IndividualPathComments = ({
  modalOpen,
  closeModal,
  id,
  rank,
  degrees,
  count,
  path,
}: {
  modalOpen: boolean;
  closeModal: () => void;
  id: string;
  rank: number;
  degrees: number;
  count: number;
  path: string;
}) => {
  return (
    <RemoveScroll enabled={modalOpen}>
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Path Details Modal"
        className="path_details_container modal_container"
        shouldFocusAfterRender={false}
        style={customModalStyles}
      >
        <h2>PATH DETAILS</h2>
        <button className="close_modal_button" onClick={closeModal}>
          <AiOutlineClose size={20} color="#fff" />
        </button>
        <p>{path}</p>
        <div className="path_details_comments_header">
          <p>2 Comments</p>
        </div>
        <div>
          <IndividualComment id="test" />
          <IndividualComment id="word" />
          <IndividualComment id="test2" />
          <IndividualComment id="test3" />
        </div>
      </Modal>
    </RemoveScroll>
  );
};
