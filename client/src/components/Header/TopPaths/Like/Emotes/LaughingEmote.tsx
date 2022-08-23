import ReactTooltip from "react-tooltip";
import RayLiottaLaughing from "../../../../../assets/EmoteImages/RayLiottaLaughing.jpg";

export const LaughingEmote = ({
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
      handleTriggerEmote("haha");
    }
  };
  return (
    <>
      {!mainButton && (
        <ReactTooltip
          className="keep_tooltip_on_hover emote_tiny_tooltip"
          id={`laughing${result ? "_result" : ""}_emote`}
          place="top"
          effect="solid"
          arrowColor="transparent"
          delayShow={0}
          delayHide={0}
        >
          <p>Haha</p>
        </ReactTooltip>
      )}
      <div
        className={`image_emoji_container react_large_emojis ${
          result ? "result" : ""
        }`}
        data-tip
        data-iscapture="true"
        data-for={`laughing${result ? "_result" : ""}_emote`}
        onClick={handleChangeEmote}
      >
        <img
          src={RayLiottaLaughing}
          alt="Ray Liotta Laughing"
          className="ray_liotta_image_emoji"
        />
      </div>
    </>
  );
};
