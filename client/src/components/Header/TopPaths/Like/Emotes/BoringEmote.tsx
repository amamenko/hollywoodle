import ReactTooltip from "react-tooltip";
import KeanuReevesBored from "../../../../../assets/EmoteImages/KeanuReevesBored.jpg";

export const BoringEmote = ({ result }: { result?: boolean }) => {
  return (
    <>
      <ReactTooltip
        className="keep_tooltip_on_hover emote_tiny_tooltip"
        id={`bored${result ? "_result" : ""}_emote`}
        place="top"
        effect="solid"
        arrowColor="transparent"
      >
        <p>Boring</p>
      </ReactTooltip>
      <div
        className="image_emoji_container react_large_emojis"
        data-tip
        data-iscapture="true"
        data-for={`bored${result ? "_result" : ""}_emote`}
      >
        <img
          src={KeanuReevesBored}
          alt="Keanu Reeves Bored"
          className="keanu_bored_emoji"
        />
      </div>
    </>
  );
};
