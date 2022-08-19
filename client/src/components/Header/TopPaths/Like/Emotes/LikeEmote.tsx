import { IoMdThumbsUp } from "react-icons/io";
import ReactTooltip from "react-tooltip";

export const LikeEmote = ({ result }: { result?: boolean }) => {
  return (
    <>
      <ReactTooltip
        className="keep_tooltip_on_hover emote_tiny_tooltip like_emote"
        id={`like${result ? "_result" : ""}_emote`}
        place="top"
        effect="solid"
        arrowColor="transparent"
      >
        <p>Like</p>
      </ReactTooltip>
      <div
        className="thumbs_up_emote_container react_large_emojis"
        data-tip
        data-iscapture="true"
        data-for={`like${result ? "_result" : ""}_emote`}
      >
        <IoMdThumbsUp size={25} />
      </div>
    </>
  );
};
