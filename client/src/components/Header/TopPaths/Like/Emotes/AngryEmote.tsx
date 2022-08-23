import ReactTooltip from "react-tooltip";
import SamuelLJackson from "../../../../../assets/EmoteImages/SamuelLJackson.jpg";

export const AngryEmote = ({
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
      handleTriggerEmote("anger");
    }
  };
  return (
    <>
      {!mainButton && (
        <ReactTooltip
          className="keep_tooltip_on_hover emote_tiny_tooltip"
          id={`anger${result ? "_result" : ""}_emote`}
          place="top"
          effect="solid"
          arrowColor="transparent"
          delayShow={0}
          delayHide={0}
        >
          <p>Anger</p>
        </ReactTooltip>
      )}
      <div
        className={`image_emoji_container react_large_emojis ${
          result ? "result" : ""
        }`}
        data-tip
        data-iscapture="true"
        data-for={`anger${result ? "_result" : ""}_emote`}
        onClick={handleChangeEmote}
      >
        <img
          src={SamuelLJackson}
          alt="Samuel L. Jackson Furious Anger"
          className="samuel_l_jackson_image_emoji"
        />
      </div>
    </>
  );
};
