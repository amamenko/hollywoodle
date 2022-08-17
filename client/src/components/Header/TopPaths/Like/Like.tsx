import { FiThumbsUp } from "react-icons/fi";
import ReactTooltip from "react-tooltip";
import { Twemoji } from "react-emoji-render";
import "./Like.scss";

export const Like = ({ rank }: { rank: number }) => {
  return (
    <>
      <div
        className="like_button_container"
        data-tip
        data-iscapture="true"
        data-for={`likeButton${rank}`}
      >
        <FiThumbsUp size={20} />
        <p className="like_button_text">Like</p>
      </div>
      <ReactTooltip
        className="keep_tooltip_on_hover"
        id={`likeButton${rank}`}
        place="top"
        effect="solid"
        arrowColor="transparent"
        clickable={true}
        delayHide={500}
        delayShow={250}
      >
        <div className="tooltip_emoji_container">
          <img
            src="https://twemoji.maxcdn.com/2/svg/1f971.svg"
            alt="Yawning face emoji"
            className="yawning_face_emoji react_large_emojis"
          />
          <Twemoji svg text=":O" onlyEmojiClassName="react_large_emojis" />
          <Twemoji svg text=">:(" onlyEmojiClassName="react_large_emojis" />
          <Twemoji svg text=":)" onlyEmojiClassName="react_large_emojis" />
        </div>
      </ReactTooltip>
    </>
  );
};
