import ReactTooltip from "react-tooltip";
import OwenWilsonWow from "../../../../../assets/EmoteImages/OwenWilsonWow.jpg";

export const WowEmote = ({ result }: { result?: boolean }) => {
  return (
    <>
      <ReactTooltip
        className="keep_tooltip_on_hover emote_tiny_tooltip"
        id={`wow${result ? "_result" : ""}_emote`}
        place="top"
        effect="solid"
        arrowColor="transparent"
      >
        <p>Wow</p>
      </ReactTooltip>
      <div
        className="image_emoji_container react_large_emojis"
        data-tip
        data-iscapture="true"
        data-for={`wow${result ? "_result" : ""}_emote`}
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
