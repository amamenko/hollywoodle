import { AngryEmote } from "./Emotes/AngryEmote";
import { BoringEmote } from "./Emotes/BoringEmote";
import { LaughingEmote } from "./Emotes/LaughingEmote";
import { LikeEmote } from "./Emotes/LikeEmote";
import { OscarEmote } from "./Emotes/OscarEmote";
import { WowEmote } from "./Emotes/WowEmote";
import "./Like.scss";

export const EmotesResults = ({
  pathCollapsed,
}: {
  pathCollapsed: boolean;
}) => {
  return (
    <div
      className="results_emote_container"
      style={{ marginTop: pathCollapsed ? "0.5rem" : "0" }}
    >
      <LikeEmote result={true} />
      <p>125</p>
      <OscarEmote result={true} />
      <p>125</p>
      <AngryEmote result={true} />
      <p>125</p>
      <WowEmote result={true} />
      <p>125</p>
      <BoringEmote result={true} />
      <p>125</p>
      <LaughingEmote result={true} />
      <p>125</p>
    </div>
  );
};
