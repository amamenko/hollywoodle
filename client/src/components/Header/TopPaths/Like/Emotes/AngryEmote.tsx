import ReactTooltip from "react-tooltip";
import SamuelLJackson from "../../../../../assets/EmoteImages/SamuelLJackson.jpg";

export const AngryEmote = ({ result }: { result?: boolean }) => {
  return (
    <>
      <ReactTooltip
        className="keep_tooltip_on_hover emote_tiny_tooltip"
        id={`anger${result ? "_result" : ""}_emote`}
        place="top"
        effect="solid"
        arrowColor="transparent"
      >
        <p>Furious anger</p>
      </ReactTooltip>
      <div
        className="image_emoji_container react_large_emojis"
        data-tip
        data-iscapture="true"
        data-for={`anger${result ? "_result" : ""}_emote`}
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
