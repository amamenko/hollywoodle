import ReactTooltip from "react-tooltip";
import { ReactComponent as Oscar } from "../../../../../assets/Oscar.svg";

export const OscarEmote = ({
  mainButton,
  result,
  changeEmoteSelected,
}: {
  mainButton?: boolean;
  result?: boolean;
  changeEmoteSelected?: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleChangeEmote = () => {
    if (changeEmoteSelected) changeEmoteSelected("Oscar");
  };
  return (
    <>
      {!mainButton && (
        <ReactTooltip
          className="keep_tooltip_on_hover emote_tiny_tooltip oscar_emote"
          id={`oscar${result ? "_result" : ""}_emote`}
          place="top"
          effect="solid"
          arrowColor="transparent"
          delayShow={0}
          delayHide={0}
        >
          <p>Oscar</p>
        </ReactTooltip>
      )}
      <div
        className={`thumbs_up_emote_container ${
          result ? "result" : ""
        } react_large_emojis oscar_emote`}
        data-tip
        data-iscapture="true"
        data-for={`oscar${result ? "_result" : ""}_emote`}
        onClick={handleChangeEmote}
      >
        <Oscar />
      </div>
    </>
  );
};
