import { useState } from "react";
import { FiThumbsUp } from "react-icons/fi";
import ReactTooltip from "react-tooltip";
import { LikeEmote } from "./Emotes/LikeEmote";
import { OscarEmote } from "./Emotes/OscarEmote";
import { AngryEmote } from "./Emotes/AngryEmote";
import { LaughingEmote } from "./Emotes/LaughingEmote";
import { WowEmote } from "./Emotes/WowEmote";
import { BoringEmote } from "./Emotes/BoringEmote";
import { handleUpdateEmotes } from "./handleUpdateEmotes";
import "./Like.scss";

export const Like = ({ rank, id }: { rank: number; id: string }) => {
  const [emoteSelected, changeEmoteSelected] = useState("");
  const handleLikeButtonClick = () => {
    if (emoteSelected) {
      handleUpdateEmotes(id, `reset_${emoteSelected}`);
      changeEmoteSelected("");
    }
  };
  return (
    <>
      <div
        className={`like_button_container ${emoteSelected.toLowerCase()}`}
        data-tip
        data-iscapture="true"
        data-for={`likeButton${rank}`}
        onClick={handleLikeButtonClick}
      >
        {emoteSelected === "Like" ? (
          <LikeEmote mainButton={true} />
        ) : emoteSelected === "Oscar" ? (
          <OscarEmote mainButton={true} />
        ) : emoteSelected === "Anger" ? (
          <AngryEmote mainButton={true} />
        ) : emoteSelected === "Wow" ? (
          <WowEmote mainButton={true} />
        ) : emoteSelected === "Boring" ? (
          <BoringEmote mainButton={true} />
        ) : emoteSelected === "Haha" ? (
          <LaughingEmote mainButton={true} />
        ) : (
          <FiThumbsUp size={20} />
        )}
        <p className={`like_button_text ${emoteSelected.toLowerCase()}`}>
          {emoteSelected || "Like"}
        </p>
      </div>
      <ReactTooltip
        className="keep_tooltip_on_hover"
        id={`likeButton${rank}`}
        place="top"
        effect="solid"
        arrowColor="transparent"
        clickable={true}
        delayHide={0}
        delayShow={0}
      >
        <div className="tooltip_emoji_container">
          <LikeEmote id={id} changeEmoteSelected={changeEmoteSelected} />
          <OscarEmote id={id} changeEmoteSelected={changeEmoteSelected} />
          <AngryEmote id={id} changeEmoteSelected={changeEmoteSelected} />
          <WowEmote id={id} changeEmoteSelected={changeEmoteSelected} />
          <BoringEmote id={id} changeEmoteSelected={changeEmoteSelected} />
          <LaughingEmote id={id} changeEmoteSelected={changeEmoteSelected} />
        </div>
      </ReactTooltip>
    </>
  );
};
