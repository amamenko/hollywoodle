import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import Modal from "react-modal";
import { RemoveScroll } from "react-remove-scroll";
import { Button } from "reactstrap";
import { IndividualComment } from "./IndividualComment";
import * as Ladda from "ladda";
import { handleUpdateComments } from "./handleUpdateComments";
import { getRandomEmoji } from "./getRandomEmoji";
import gradient from "random-gradient";
import { Comments } from "../../../../interfaces/Comments.interface";
import { getStorageObj } from "../../../../utils/getStorageObj";
import "./Comment.scss";
import "ladda/dist/ladda.min.css";

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
  comments,
  path,
}: {
  modalOpen: boolean;
  closeModal: () => void;
  comment: string;
  changeComment: React.Dispatch<React.SetStateAction<string>>;
  id: string;
  comments: Comments[];
  path: string;
}) => {
  const [textareaClicked, changeTextareaClicked] = useState(false);
  const [laddaLoading, changeLaddaLoading] = useState(false);
  const [currentEmoji, changeCurrentEmoji] = useState("");
  const [currentBackgroundGradient, changeCurrentBackgroundGradient] =
    useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const laddaRef = useRef<HTMLButtonElement | null>(null);
  const [browserWidth, changeBrowserWidth] = useState(
    Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    )
  );

  useEffect(() => {
    if (!currentEmoji) {
      const randEmoji = getRandomEmoji(comments);
      changeCurrentEmoji(randEmoji);
    }
  }, [currentEmoji, comments]);

  useEffect(() => {
    if (!currentBackgroundGradient) {
      const storageObj = getStorageObj();
      const userId = storageObj.id ? storageObj.id.toString() : id;
      const randGradient = gradient(userId);
      changeCurrentBackgroundGradient(randGradient);
    }
  }, [currentBackgroundGradient, id]);

  const handleAddComment = async () => {
    if (laddaRef && laddaRef.current) {
      let l = Ladda.create(laddaRef.current);
      changeLaddaLoading(true);
      l.start();
      const storageObj = getStorageObj();
      const currentId = storageObj.id.toString();
      await handleUpdateComments(
        id,
        currentId,
        comment,
        currentEmoji,
        currentBackgroundGradient
      )
        .then((res) => {
          if (l.isLoading()) l.stop();
          changeComment("");
          changeLaddaLoading(false);
          if (res && res.data) {
            const updatedCommentId = res.data;
            if (Array.isArray(storageObj.comments)) {
              localStorage.setItem(
                "hollywoodle-statistics",
                JSON.stringify({
                  ...storageObj,
                  comments: [...storageObj.comments, updatedCommentId],
                })
              );
            }
          }
        })
        .catch((e) => {
          console.error(e);
          changeLaddaLoading(false);
        });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
      );
      changeBrowserWidth(currentWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length < 200) {
      changeComment(e.target.value);
    } else {
      changeComment(e.target.value.slice(0, 200));
    }
  };
  const handleResetComment = () => {
    changeComment("");
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
        <h2>HOLLYWOODLE PATH DETAILS</h2>
        <button className="close_modal_button" onClick={closeModal}>
          <AiOutlineClose size={20} color="#fff" />
        </button>
        <p className="path_details_path_text">{path}</p>
        <div className="path_details_comments_header">
          <p>{comments ? comments.length : 0} Comments</p>
        </div>
        <div className="path_comments_container">
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
              cols={browserWidth > 768 ? 47 : 35}
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
          <div className="comment_bottom_container">
            <p
              className={`comment_length_limit ${!comment ? "disabled" : ""} ${
                comment.length >= 200
                  ? "error"
                  : comment.length >= 180
                  ? "warning"
                  : ""
              }`}
            >
              {comment.length}/200
            </p>
            <div className="comment_buttons">
              <Button
                className="guess_button comment_cancel"
                onClick={handleResetComment}
              >
                <span className="ladda-label">CANCEL</span>
              </Button>
              <Button
                className={`guess_button ladda-button comment_button ${
                  comment ? "" : "disabled_comment"
                } ${laddaLoading ? "loading" : ""}`}
                onClick={handleAddComment}
                data-style="zoom-out"
                data-spinner-color="#000"
                innerRef={laddaRef}
              >
                <span className="ladda-label">COMMENT</span>
              </Button>
            </div>
          </div>
          <div className="individual_comments_container">
            {!comments || comments.length === 0 ? (
              <p className="no_comments_statement">
                There aren't any comments yet.
              </p>
            ) : (
              comments.map((comment, i) => {
                return (
                  <React.Fragment key={`${comment._id}${i}`}>
                    <IndividualComment
                      commentId={comment._id}
                      userId={comment.userId}
                      comment={comment.comment}
                      commentEmoji={comment.emoji}
                      background={comment.background}
                      countryCode={comment.countryCode}
                      countryName={comment.countryName}
                      city={comment.city}
                      score={comment.score}
                      time={comment.time}
                    />
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>
      </Modal>
    </RemoveScroll>
  );
};
