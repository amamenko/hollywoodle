import ReactTooltip from "react-tooltip";
import RayLiottaLaughing from "../../../../../assets/EmoteImages/RayLiottaLaughing.jpg";
import { handleUpdateEmotes } from "../handleUpdateEmotes";

export const LaughingEmote = ({
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
      changeEmoteSelected("Haha");
      handleUpdateEmotes(id, "haha");
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
