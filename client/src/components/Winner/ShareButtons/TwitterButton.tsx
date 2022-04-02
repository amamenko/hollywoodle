import { FC } from "react";
import { GrTwitter } from "react-icons/gr";

interface TwitterButtonProps {
  twitterShareLink?: string;
  twitterShareText?: string;
  twitterShareHashtags?: string[];
}
const TwitterButton: FC<TwitterButtonProps> = ({
  twitterShareLink,
  twitterShareText,
  twitterShareHashtags,
}) => {
  return (
    <li className="share_button_outer_container">
      <a
        href={
          twitterShareLink
            ? `https://twitter.com/intent/tweet?url=${encodeURI(
                twitterShareLink
              )}${
                twitterShareText
                  ? `&text=${encodeURIComponent(twitterShareText)}`
                  : ""
              }${
                twitterShareHashtags
                  ? twitterShareHashtags.length > 0
                    ? `&hashtags=${twitterShareHashtags
                        .map((item) => encodeURIComponent(item))
                        .join()}`
                    : ""
                  : ""
              }`
            : ""
        }
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="share_button twitter_share_button">
          <GrTwitter className="twitter_share_button_icon" />
        </button>
      </a>
    </li>
  );
};

export default TwitterButton;
