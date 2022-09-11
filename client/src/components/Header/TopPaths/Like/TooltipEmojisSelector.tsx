import { useEffect, useState } from "react";
import { AngryEmote } from "./Emotes/AngryEmote";
import { BoringEmote } from "./Emotes/BoringEmote";
import { LaughingEmote } from "./Emotes/LaughingEmote";
import { LikeEmote } from "./Emotes/LikeEmote";
import { OscarEmote } from "./Emotes/OscarEmote";
import { WowEmote } from "./Emotes/WowEmote";

export const TooltipEmojisSelector = ({
  handleTriggerEmote,
}: {
  handleTriggerEmote: (emote: string) => Promise<void>;
}) => {
  const [browserWidth, changeBrowserWidth] = useState(
    Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    )
  );
  useEffect(() => {
    const handleResize = () => {
      const currentWidth = Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
      );
      changeBrowserWidth(currentWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
  return (
    <div className="tooltip_emoji_container">
      <LikeEmote
        handleTriggerEmote={handleTriggerEmote}
        mainButton={browserWidth < 768}
      />
      <OscarEmote
        handleTriggerEmote={handleTriggerEmote}
        mainButton={browserWidth < 768}
      />
      <AngryEmote
        handleTriggerEmote={handleTriggerEmote}
        mainButton={browserWidth < 768}
      />
      <WowEmote
        handleTriggerEmote={handleTriggerEmote}
        mainButton={browserWidth < 768}
      />
      <BoringEmote
        handleTriggerEmote={handleTriggerEmote}
        mainButton={browserWidth < 768}
      />
      <LaughingEmote
        handleTriggerEmote={handleTriggerEmote}
        mainButton={browserWidth < 768}
      />
    </div>
  );
};
