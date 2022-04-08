import { FC } from "react";
import { FaFacebook } from "react-icons/fa";

interface FacebookButtonProps {
  facebookShareLink?: string;
  facebookShareText?: string;
}

const FacebookButton: FC<FacebookButtonProps> = ({
  facebookShareLink,
  facebookShareText,
}) => {
  return (
    <li className="share_button_outer_container">
      <a
        href={
          facebookShareLink
            ? `https://www.facebook.com/sharer.php?u=${encodeURI(
                facebookShareLink
              )}&quote=${facebookShareText ? encodeURI(facebookShareText) : ""}`
            : ""
        }
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="share_button facebook_share_button">
          <FaFacebook className="facebook_share_button_icon" />
        </button>
      </a>
    </li>
  );
};

export default FacebookButton;
