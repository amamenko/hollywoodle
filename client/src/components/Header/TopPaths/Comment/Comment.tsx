import { useState } from "react";
import { FaCommentDots, FaRegComment } from "react-icons/fa";
import "./Comment.scss";
import { IndividualPathComments } from "./IndividualPathComments";

export const Comment = ({
  id,
  path,
  degrees,
  rank,
  count,
}: {
  id: string;
  path: string;
  degrees: number;
  rank: number;
  count: number;
}) => {
  const [modalOpen, changeModalOpen] = useState(false);
  const openModal = () => changeModalOpen(true);
  const closeModal = () => changeModalOpen(false);
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
      <div className="total_comments_container">
        <FaRegComment size={20} />
        <p className="total_comments_text">0</p>
      </div>
      <IndividualPathComments
        modalOpen={modalOpen}
        closeModal={closeModal}
        id={id}
        rank={rank}
        degrees={degrees}
        count={count}
        path={path}
      />
    </>
  );
};
