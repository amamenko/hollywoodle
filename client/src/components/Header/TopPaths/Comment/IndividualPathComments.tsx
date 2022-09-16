import { useLayoutEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
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
  comment,
  changeComment,
  id,
  rank,
  degrees,
  count,
  path,
}: {
  modalOpen: boolean;
  closeModal: () => void;
  comment: string;
  changeComment: React.Dispatch<React.SetStateAction<string>>;
  id: string;
  rank: number;
  degrees: number;
  count: number;
  path: string;
}) => {
  const [textareaClicked, changeTextareaClicked] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    changeComment(e.target.value);
  };
  useLayoutEffect(() => {
    if (textareaRef && textareaRef.current) {
      // Reset height - important to shrink on delete
      textareaRef.current.style.height = "inherit";
      // Set height
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        16
      )}px`;
    }
  }, [comment]);
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
        <p className="path_details_path_text">{path}</p>
        <div className="path_details_comments_header">
          <p>2 Comments</p>
        </div>
        <div className="path_comments_container">
          {/* <p className="no_comments_statement">
            There aren't any comments yet.
          </p> */}
          <div
            className="path_comment_box col-3 input-effect"
            style={{
              margin: textareaClicked ? "35px 3% 0 0" : "15px 3% 0 0",
            }}
          >
            <textarea
              ref={textareaRef}
              className="effect-16"
              name="text"
              cols={50}
              placeholder=" "
              value={comment}
              onChange={handleChangeComment}
              onClick={() => changeTextareaClicked(true)}
              onBlur={() => changeTextareaClicked(false)}
              style={{
                minHeight: 16,
                resize: "none",
                backgroundColor: comment ? "rgb(30, 30, 30)" : "transparent",
              }}
            />
            <label>
              Add a comment...
              <BsPencilSquare
                style={{ opacity: textareaClicked || comment ? 0 : 1 }}
              />
            </label>
            <span className="focus-border"></span>
          </div>
          <IndividualComment id="test" />
          <IndividualComment id="word" />
          <IndividualComment id="test2" />
          <IndividualComment id="test3" />
        </div>
      </Modal>
    </RemoveScroll>
  );
};
