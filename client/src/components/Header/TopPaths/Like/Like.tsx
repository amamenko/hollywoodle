import { FiThumbsUp } from "react-icons/fi";
import ReactTooltip from "react-tooltip";
import { IoMdThumbsUp } from "react-icons/io";
import { ReactComponent as Oscar } from "../../../../assets/Oscar.svg";
import "./Like.scss";

export const Like = ({ rank }: { rank: number }) => {
  return (
    <>
      <div
        className="like_button_container"
        data-tip
        data-iscapture="true"
        data-for={`likeButton${rank}`}
      >
        <FiThumbsUp size={20} />
        <p className="like_button_text">Like</p>
      </div>
      <ReactTooltip
        className="keep_tooltip_on_hover"
        id={`likeButton${rank}`}
        place="top"
        effect="solid"
        arrowColor="transparent"
        clickable={true}
        delayHide={500}
        delayShow={250}
      >
        <div className="tooltip_emoji_container">
          <ReactTooltip
            className="keep_tooltip_on_hover emote_tiny_tooltip like_emote"
            id={"like_emote"}
            place="top"
            effect="solid"
            arrowColor="transparent"
          >
            <p>Like</p>
          </ReactTooltip>
          <div
            className="thumbs_up_emote_container react_large_emojis"
            data-tip
            data-iscapture="true"
            data-for={"like_emote"}
          >
            <IoMdThumbsUp size={25} />
          </div>
          <ReactTooltip
            className="keep_tooltip_on_hover emote_tiny_tooltip oscar_emote"
            id={"oscar_emote"}
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
            data-for={"oscar_emote"}
          >
            <Oscar />
          </div>
          {/* <img
            src="https://twemoji.maxcdn.com/2/svg/1f971.svg"
            alt="Yawning face emoji"
            className="yawning_face_emoji react_large_emojis"
          /> */}
          <ReactTooltip
            className="keep_tooltip_on_hover emote_tiny_tooltip"
            id={"anger_emote"}
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
            data-for={"anger_emote"}
          >
            <img
              src="https://cdn.imgbin.com/1/4/22/imgbin-quentin-tarantino-pulp-fiction-jules-winnfield-vincent-vega-mia-wallace-lebron-H99zrCwWkYDeJXfR8ykxPiPit.jpg"
              alt="Samuel L. Jackson Furious Anger"
              className="samuel_l_jackson_image_emoji"
            />
          </div>
          <ReactTooltip
            className="keep_tooltip_on_hover emote_tiny_tooltip"
            id={"wow_emote"}
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
            data-for={"wow_emote"}
          >
            <img
              src="https://cdn-images-1.listennotes.com/podcasts/wtf-happened-to/owen-wilson-SJ9e2k5XFY0-6cFMYAJEjHv.1400x1400.jpg"
              alt="Owen Wilson Wow"
              className="owen_wilson_image_emoji"
            />
          </div>
          <ReactTooltip
            className="keep_tooltip_on_hover emote_tiny_tooltip"
            id={"bored_emote"}
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
            data-for={"bored_emote"}
          >
            <img
              src="https://pbs.twimg.com/media/DkRO2vDX4AEws-6.jpg"
              alt="Keanu Reeves Bored"
              className="keanu_bored_emoji"
            />
          </div>
          <ReactTooltip
            className="keep_tooltip_on_hover emote_tiny_tooltip"
            id={"laughing_emote"}
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
            data-for={"laughing_emote"}
          >
            <img
              src="https://pbs.twimg.com/media/FTtdcfbWUA4bw8B?format=jpg&name=900x900"
              alt="Ray Liotta Laughing"
              className="ray_liotta_image_emoji"
            />
          </div>
        </div>
      </ReactTooltip>
    </>
  );
};
