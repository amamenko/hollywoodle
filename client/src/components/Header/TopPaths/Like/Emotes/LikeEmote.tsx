import { IoMdThumbsUp } from "react-icons/io";
import ReactTooltip from "react-tooltip";
import { handleUpdateEmotes } from "../handleUpdateEmotes";

export const LikeEmote = ({
  id,
  mainButton,
  result,
  changeEmoteSelected,
}: {
  id?: string;
  mainButton?: boolean;
  result?: boolean;
  changeEmoteSelected?: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleChangeEmote = () => {
    if (changeEmoteSelected && id) {
      changeEmoteSelected("Like");
      handleUpdateEmotes(id, "like");
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
