import ReactTooltip from "react-tooltip";
import NapoleonDynamite from "../../../../../assets/EmoteImages/NapoleonDynamite.jpg";

export const BoringEmote = ({
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
      handleTriggerEmote("boring");
    }
  };
  return (
    <>
      {!mainButton && (
        <ReactTooltip
          className="keep_tooltip_on_hover emote_tiny_tooltip"
          id={`bored${result ? "_result" : ""}_emote`}
          place="top"
          effect="solid"
          arrowColor="transparent"
          delayShow={0}
          delayHide={0}
        >
          <p>Boring</p>
        </ReactTooltip>
      )}
      <div
        className={`image_emoji_container react_large_emojis ${
          result ? "result" : ""
        }`}
        data-tip
        data-iscapture="true"
        data-for={`bored${result ? "_result" : ""}_emote`}
        onClick={handleChangeEmote}
      >
        <img
          src={NapoleonDynamite}
          alt="Napoleon Dynamite Bored"
          className="napoleon_bored_emoji"
        />
      </div>
    </>
  );
};
