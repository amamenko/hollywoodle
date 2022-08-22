import { Emotes } from "../../../../interfaces/Emotes.interface";
import { AngryEmote } from "./Emotes/AngryEmote";
import { BoringEmote } from "./Emotes/BoringEmote";
import { LaughingEmote } from "./Emotes/LaughingEmote";
import { LikeEmote } from "./Emotes/LikeEmote";
import { OscarEmote } from "./Emotes/OscarEmote";
import { WowEmote } from "./Emotes/WowEmote";
import "./Like.scss";

export const EmotesResults = ({
  pathCollapsed,
  emotes,
}: {
  pathCollapsed: boolean;
  emotes: Emotes;
}) => {
  return (
    <div
      className="results_emote_container"
      style={{
        marginTop: pathCollapsed ? "0.5rem" : "0",
        display:
          !emotes.like &&
          !emotes.oscar &&
          !emotes.anger &&
          !emotes.wow &&
          !emotes.boring &&
          !emotes.haha
            ? "none"
            : "flex",
      }}
    >
      {!emotes.like || emotes.like <= 0 ? (
        <></>
      ) : (
        <>
          <LikeEmote result={true} />
          <p>{emotes.like}</p>
        </>
      )}
      {!emotes.oscar || emotes.oscar <= 0 ? (
        <></>
      ) : (
        <>
          <OscarEmote result={true} />
          <p>{emotes.oscar}</p>
        </>
      )}
      {!emotes.anger || emotes.anger <= 0 ? (
        <></>
      ) : (
        <>
          <AngryEmote result={true} />
          <p>{emotes.anger}</p>
        </>
      )}
      {!emotes.wow || emotes.wow <= 0 ? (
        <></>
      ) : (
        <>
          <WowEmote result={true} />
          <p>{emotes.wow}</p>
        </>
      )}
      {!emotes.boring || emotes.boring <= 0 ? (
        <></>
      ) : (
        <>
          <BoringEmote result={true} />
          <p>{emotes.boring}</p>
        </>
      )}
      {!emotes.haha || emotes.haha <= 0 ? (
        <></>
      ) : (
        <>
          <LaughingEmote result={true} />
          <p>{emotes.haha}</p>
        </>
      )}
    </div>
  );
};
