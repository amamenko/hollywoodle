import ReactTooltip from "react-tooltip";
import OwenWilsonWow from "../../../../../assets/EmoteImages/OwenWilsonWow.jpg";
import { handleUpdateEmotes } from "../handleUpdateEmotes";

export const WowEmote = ({
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
      changeEmoteSelected("Wow");
      handleUpdateEmotes(id, "wow");
    }
  };
  return (
    <>
      {!mainButton && (
        <ReactTooltip
          className="keep_tooltip_on_hover emote_tiny_tooltip"
          id={`wow${result ? "_result" : ""}_emote`}
          place="top"
          effect="solid"
          arrowColor="transparent"
          delayShow={0}
          delayHide={0}
        >
          <p>Wow</p>
        </ReactTooltip>
      )}
      <div
        className={`image_emoji_container react_large_emojis ${
          result ? "result" : ""
        }`}
        data-tip
        data-iscapture="true"
        data-for={`wow${result ? "_result" : ""}_emote`}
        onClick={handleChangeEmote}
      >
        <img
          src={OwenWilsonWow}
          alt="Owen Wilson Wow"
          className="owen_wilson_image_emoji"
        />
      </div>
    </>
  );
};
