import ReactTooltip from "react-tooltip";
import { ReactComponent as Oscar } from "../../../../../assets/Oscar.svg";

export const OscarEmote = ({ result }: { result?: boolean }) => {
  return (
    <>
      <ReactTooltip
        className="keep_tooltip_on_hover emote_tiny_tooltip oscar_emote"
        id={`oscar${result ? "_result" : ""}_emote`}
        place="top"
        effect="solid"
        arrowColor="transparent"
      >
        <p>Oscar</p>
      </ReactTooltip>
      <div
        className="thumbs_up_emote_container react_large_emojis oscar_emote"
        data-tip
        data-iscapture="true"
        data-for={`oscar${result ? "_result" : ""}_emote`}
      >
        <Oscar />
      </div>
    </>
  );
};
