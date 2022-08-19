import { FiThumbsUp } from "react-icons/fi";
import ReactTooltip from "react-tooltip";
import { LikeEmote } from "./Emotes/LikeEmote";
import { OscarEmote } from "./Emotes/OscarEmote";
import { AngryEmote } from "./Emotes/AngryEmote";
import { LaughingEmote } from "./Emotes/LaughingEmote";
import { WowEmote } from "./Emotes/WowEmote";
import { BoringEmote } from "./Emotes/BoringEmote";
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
          <LikeEmote />
          <OscarEmote />
          <AngryEmote />
          <WowEmote />
          <BoringEmote />
          <LaughingEmote />
        </div>
      </ReactTooltip>
    </>
  );
};
