import ReactTooltip from "react-tooltip";
import RayLiottaLaughing from "../../../../../assets/EmoteImages/RayLiottaLaughing.jpg";

export const LaughingEmote = ({ result }: { result?: boolean }) => {
  return (
    <>
      <ReactTooltip
        className="keep_tooltip_on_hover emote_tiny_tooltip"
        id={`laughing${result ? "_result" : ""}_emote`}
        place="top"
        effect="solid"
        arrowColor="transparent"
      >
        <p>Haha</p>
      </ReactTooltip>
      <div
        className="image_emoji_container react_large_emojis"
        data-tip
        data-iscapture="true"
        data-for={`laughing${result ? "_result" : ""}_emote`}
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
