import { useState } from "react";
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
  const [emoteSelected, changeEmoteSelected] = useState("");
  return (
    <>
      <div
        className={`like_button_container ${emoteSelected.toLowerCase()}`}
        data-tip
        data-iscapture="true"
        data-for={`likeButton${rank}`}
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
        delayHide={500}
        delayShow={250}
      >
        <div className="tooltip_emoji_container">
          <LikeEmote changeEmoteSelected={changeEmoteSelected} />
          <OscarEmote changeEmoteSelected={changeEmoteSelected} />
          <AngryEmote changeEmoteSelected={changeEmoteSelected} />
          <WowEmote changeEmoteSelected={changeEmoteSelected} />
          <BoringEmote changeEmoteSelected={changeEmoteSelected} />
          <LaughingEmote changeEmoteSelected={changeEmoteSelected} />
        </div>
      </ReactTooltip>
    </>
  );
};
