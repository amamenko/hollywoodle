import { AngryEmote } from "./Emotes/AngryEmote";
import { BoringEmote } from "./Emotes/BoringEmote";
import { LaughingEmote } from "./Emotes/LaughingEmote";
import { LikeEmote } from "./Emotes/LikeEmote";
import { OscarEmote } from "./Emotes/OscarEmote";
import { WowEmote } from "./Emotes/WowEmote";

interface DebouncedFunc {
  (emote: string): Promise<void> | undefined;
}

export const TooltipEmojisSelector = ({
  debouncedTriggerEmote,
}: {
  debouncedTriggerEmote: DebouncedFunc;
}) => {
  return (
    <div className="tooltip_emoji_container">
      <LikeEmote handleTriggerEmote={debouncedTriggerEmote} />
      <OscarEmote handleTriggerEmote={debouncedTriggerEmote} />
      <AngryEmote handleTriggerEmote={debouncedTriggerEmote} />
      <WowEmote handleTriggerEmote={debouncedTriggerEmote} />
      <BoringEmote handleTriggerEmote={debouncedTriggerEmote} />
      <LaughingEmote handleTriggerEmote={debouncedTriggerEmote} />
    </div>
  );
};
