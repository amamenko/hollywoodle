import React, { FC } from "react";
import { GrTwitter } from "react-icons/gr";
import { TwitterButtonProps } from "../ShareButtons/TwitterButton";

export const ShareViaTweet: FC<TwitterButtonProps> = ({ twitterShareText }) => {
  return (
    <div className="winner_kofi_button">
      <div className="btn-container share">
        <a
          className="kofi-button twitter share"
          href={`https://twitter.com/intent/tweet?${
            twitterShareText
              ? `&text=${encodeURIComponent(twitterShareText.trim())}`
              : ""
          }`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="kofitext">
            TWEET
            <GrTwitter className="kofiimg" size={23} />
          </span>
        </a>
      </div>
    </div>
  );
};
