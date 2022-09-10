import { useEffect, useState } from "react";
import { FiThumbsUp } from "react-icons/fi";
import ReactTooltip from "react-tooltip";
import { LikeEmote } from "./Emotes/LikeEmote";
import { OscarEmote } from "./Emotes/OscarEmote";
import { AngryEmote } from "./Emotes/AngryEmote";
import { LaughingEmote } from "./Emotes/LaughingEmote";
import { WowEmote } from "./Emotes/WowEmote";
import { BoringEmote } from "./Emotes/BoringEmote";
import { handleUpdateEmotes } from "./handleUpdateEmotes";
import debounce from "lodash/debounce";
import { TooltipEmojisSelector } from "./TooltipEmojisSelector";
import "./Like.scss";

export const Like = ({ rank, id }: { rank: number; id: string }) => {
  const [emoteSelected, changeEmoteSelected] = useState("");
  const getStorageObj = () => {
    const storageStr = localStorage.getItem("hollywoodle-statistics");
    let storageObj: {
      [key: string]:
        | number
        | number[]
        | string
        | boolean
        | { [key: string]: string }[];
    } = {};
    try {
      storageObj = JSON.parse(storageStr ? storageStr : "");
    } catch (e) {
      console.error(e);
    }
    return storageObj;
  };
  const handleResetEmote = async () => {
    return new Promise(async (resolve, reject) => {
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
          changeEmoteSelected("");
          resolve("reset");
        }
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  };
  const handleTriggerEmote = async (emote: string) => {
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
        changeEmoteSelected(emoteCapitalized);
      };
      if (!emoteSelected) {
        await handleNewEmoteUpdate();
      } else {
        if (emoteSelected === emoteCapitalized) {
          await handleResetEmote();
        } else {
          await handleResetEmote();
          await handleNewEmoteUpdate();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };
  const debouncedTriggerEmote = debounce(handleTriggerEmote, 500, {
    trailing: true,
    maxWait: 1000,
  });

  useEffect(() => {
    const storageObj = getStorageObj();
    const allEmotes = storageObj.emotes as {
      [key: string]: string;
    }[];
    const foundEmoteObj = Array.isArray(allEmotes)
      ? allEmotes.find((el) => el.id === id)
      : undefined;
    if (foundEmoteObj) {
      const foundEmote = foundEmoteObj.emote;
      changeEmoteSelected(
        foundEmote.charAt(0).toUpperCase() + foundEmote.slice(1)
      );
    }
  }, [id]);
  return (
    <>
      <div
        className={`like_button_container ${emoteSelected.toLowerCase()}`}
        data-tip
        data-iscapture="true"
        data-for={`likeButton${rank}`}
        onMouseUp={handleResetEmote}
        onTouchEnd={handleResetEmote}
      >
        {emoteSelected === "Like" ? (
          <LikeEmote mainButton={true} />
        ) : emoteSelected === "Oscar" ? (
          <OscarEmote mainButton={true} />
        ) : emoteSelected === "Anger" ? (
          <AngryEmote mainButton={true} />
        ) : emoteSelected === "Wow" ? (
          <WowEmote mainButton={true} />
        ) : emoteSelected === "Boring" ? (
          <BoringEmote mainButton={true} />
        ) : emoteSelected === "Haha" ? (
          <LaughingEmote mainButton={true} />
        ) : (
          <FiThumbsUp size={20} />
        )}
        <p className={`like_button_text ${emoteSelected.toLowerCase()}`}>
          {emoteSelected || "Like"}
        </p>
      </div>
      <ReactTooltip
        className="keep_tooltip_on_hover"
        id={`likeButton${rank}`}
        place="top"
        effect="solid"
        arrowColor="transparent"
        clickable={true}
        delayHide={0}
        delayShow={0}
        globalEventOff={"click"}
      >
        <TooltipEmojisSelector debouncedTriggerEmote={debouncedTriggerEmote} />
      </ReactTooltip>
    </>
  );
};
