import { useRef, useState } from "react";
import { FiThumbsUp } from "react-icons/fi";
import ReactTooltip from "react-tooltip";
import { LikeEmote } from "./Emotes/LikeEmote";
import { OscarEmote } from "./Emotes/OscarEmote";
import { AngryEmote } from "./Emotes/AngryEmote";
import { LaughingEmote } from "./Emotes/LaughingEmote";
import { WowEmote } from "./Emotes/WowEmote";
import { BoringEmote } from "./Emotes/BoringEmote";
import { handleUpdateEmotes } from "./handleUpdateEmotes";
import { TooltipEmojisSelector } from "./TooltipEmojisSelector";
import "./Like.scss";

interface StorageObj {
  [key: string]:
    | number
    | number[]
    | string
    | boolean
    | { [key: string]: string }[];
}

export const Like = ({ rank, id }: { rank: number; id: string }) => {
  const tooltipEl = useRef<HTMLDivElement>(null);
  const [hideTooltip, changeHideTooltip] = useState(false);
  const getStorageObj = () => {
    const storageStr = localStorage.getItem("hollywoodle-statistics");
    let storageObj: StorageObj = {};
    try {
      storageObj = JSON.parse(storageStr ? storageStr : "");
    } catch (e) {
      console.error(e);
    }
    return storageObj;
  };
  const findEmoteByID = () => {
    const storageObj = getStorageObj();
    const allEmotes = storageObj.emotes as {
      [key: string]: string;
    }[];
    const foundEmoteObj = Array.isArray(allEmotes)
      ? allEmotes.find((el) => el.id === id)
      : undefined;
    if (foundEmoteObj) {
      const foundEmote = foundEmoteObj.emote;
      return foundEmote.charAt(0).toUpperCase() + foundEmote.slice(1);
    }
  };
  const handleResetEmote = async () => {
    return new Promise(async (resolve, reject) => {
      const emoteSelected = findEmoteByID();
      try {
        if (emoteSelected) {
          await handleUpdateEmotes(id, `reset_${emoteSelected.toLowerCase()}`);
          const storageObj = getStorageObj();
          if (Array.isArray(storageObj.emotes)) {
            const allEmotes = [...storageObj.emotes] as {
              [key: string]: string;
            }[];
            const foundEmoteIndex = allEmotes.findIndex((el) => el.id === id);
            if (foundEmoteIndex > -1) {
              allEmotes.splice(foundEmoteIndex, 1);
              localStorage.setItem(
                "hollywoodle-statistics",
                JSON.stringify({
                  ...storageObj,
                  emotes: allEmotes,
                })
              );
            } else {
              resolve("no index found");
            }
          }
          resolve("reset");
        }
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  };
  const handleShowTooltip = () => {
    if (tooltipEl.current) ReactTooltip.show(tooltipEl.current);
  };
  const handleHideTooltip = () => {
    if (tooltipEl.current) ReactTooltip.hide(tooltipEl.current);
  };
  const handleTriggerEmote = async (emote: string) => {
    // Hide tooltip on emote trigger
    handleHideTooltip();
    changeHideTooltip(true);
    setTimeout(() => changeHideTooltip(false), 500);
    const emoteSelected = findEmoteByID();
    try {
      const emoteCapitalized = emote.charAt(0).toUpperCase() + emote.slice(1);
      const emoteObj = { id, emote };
      const handleNewEmoteUpdate = async () => {
        const storageObj = getStorageObj();
        await handleUpdateEmotes(id, emote);
        if (Array.isArray(storageObj.emotes)) {
          const allEmotes = [...storageObj.emotes] as {
            [key: string]: string;
          }[];
          localStorage.setItem(
            "hollywoodle-statistics",
            JSON.stringify({
              ...storageObj,
              emotes: [...allEmotes, emoteObj],
            })
          );
        } else {
          localStorage.setItem(
            "hollywoodle-statistics",
            JSON.stringify({
              ...storageObj,
              emotes: [emoteObj],
            })
          );
        }
      };
      if (!emoteSelected) {
        await handleNewEmoteUpdate();
      } else {
        if (emoteSelected === emoteCapitalized) {
          await handleResetEmote();
        } else {
          await handleResetEmote().then(async () => {
            await handleNewEmoteUpdate();
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRenderLikeButton = () => {
    const currentEmoteSelected = findEmoteByID();
    if (currentEmoteSelected === "Like") {
      return <LikeEmote mainButton={true} />;
    } else if (currentEmoteSelected === "Oscar") {
      return <OscarEmote mainButton={true} />;
    } else if (currentEmoteSelected === "Anger") {
      return <AngryEmote mainButton={true} />;
    } else if (currentEmoteSelected === "Wow") {
      return <WowEmote mainButton={true} />;
    } else if (currentEmoteSelected === "Boring") {
      return <BoringEmote mainButton={true} />;
    } else if (currentEmoteSelected === "Haha") {
      return <LaughingEmote mainButton={true} />;
    } else {
      return <FiThumbsUp size={20} />;
    }
  };
  const handleDynamicClassname = () => {
    const currentEmoteSelected = findEmoteByID();
    if (currentEmoteSelected) {
      return currentEmoteSelected.toLowerCase();
    } else {
      return "";
    }
  };
  const handleButtonText = () => {
    const currentEmoteSelected = findEmoteByID();
    return currentEmoteSelected || "Like";
  };
  return (
    <>
      <div
        className={`like_button_container ${handleDynamicClassname()}`}
        data-tip
        data-iscapture="true"
        data-for={`likeButton${rank}`}
        ref={tooltipEl}
        onClick={() => {
          handleShowTooltip();
        }}
        onTouchEnd={() => {
          handleShowTooltip();
        }}
      >
        {handleRenderLikeButton()}
        <p className={`like_button_text  ${handleDynamicClassname()}`}>
          {handleButtonText()}
        </p>
      </div>
      {!hideTooltip && (
        <ReactTooltip
          className="keep_tooltip_on_hover"
          id={`likeButton${rank}`}
          place="bottom"
          effect="solid"
          arrowColor="transparent"
          clickable={true}
          delayHide={0}
          delayShow={0}
          globalEventOff={"click"}
        >
          <TooltipEmojisSelector handleTriggerEmote={handleTriggerEmote} />
        </ReactTooltip>
      )}
    </>
  );
};
