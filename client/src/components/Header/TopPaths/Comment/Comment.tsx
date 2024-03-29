import { useState } from "react";
import { FaCommentDots, FaRegComment } from "react-icons/fa";
import { IndividualPathComments } from "./IndividualPathComments";
import { Comments } from "../../../../interfaces/Comments.interface";
import "./Comment.scss";

export const Comment = ({
  id,
  comments,
  path,
}: {
  id: string;
  comments: Comments[];
  path: string;
}) => {
  const [modalOpen, changeModalOpen] = useState(false);
  const [comment, changeComment] = useState("");
  const openModal = () => changeModalOpen(true);
  const closeModal = () => {
    changeModalOpen(false);
    if (comment) changeComment("");
  };
  return (
    <>
      <div
        className={"comment_container"}
        data-tip
        data-iscapture="true"
        onClick={openModal}
      >
        <FaCommentDots size={20} className="comment_icon" />
        <p className={"comment_text"}>Comment</p>
      </div>
      <div className="total_comments_container" onClick={openModal}>
        <FaRegComment size={20} />
        <p
          className={`total_comments_text ${
            comments ? (comments.length > 0 ? "active" : "") : ""
          }`}
        >
          {comments ? comments.length : 0}
        </p>
      </div>
      <IndividualPathComments
        modalOpen={modalOpen}
        closeModal={closeModal}
        comment={comment}
        changeComment={changeComment}
        id={id}
        comments={comments}
        path={path}
      />
    </>
  );
};
