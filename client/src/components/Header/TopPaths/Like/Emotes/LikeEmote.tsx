import { IoMdThumbsUp } from "react-icons/io";
import ReactTooltip from "react-tooltip";

export const LikeEmote = ({
  handleTriggerEmote,
  mainButton,
  result,
}: {
  handleTriggerEmote?: (emote: string) => void;
  mainButton?: boolean;
  result?: boolean;
}) => {
  const handleChangeEmote = () => {
    if (handleTriggerEmote && typeof handleTriggerEmote === "function") {
      handleTriggerEmote("like");
    }
  };
  return (
    <>
      {!mainButton && (
        <ReactTooltip
          className="keep_tooltip_on_hover emote_tiny_tooltip like_emote"
          id={`like${result ? "_result" : ""}_emote`}
          place="top"
          effect="solid"
          arrowColor="transparent"
          delayShow={0}
          delayHide={0}
        >
          <p>Like</p>
        </ReactTooltip>
      )}
      <div
        className={`thumbs_up_emote_container ${
          result ? "result" : ""
        } react_large_emojis like_emote`}
        data-tip
        data-iscapture="true"
        data-for={`like${result ? "_result" : ""}_emote`}
        onClick={handleChangeEmote}
      >
        <IoMdThumbsUp size={25} />
      </div>
    </>
  );
};
