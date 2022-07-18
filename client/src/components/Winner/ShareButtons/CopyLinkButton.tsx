import { Dispatch, FC, SetStateAction } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { HiLink } from "react-icons/hi";
import { IoFootstepsSharp } from "react-icons/io5";
import { handleShareLinkClicked } from "../handleShareLinkClicked";

export interface CopyLinkButtonProps {
  shareLinkClicked: boolean;
  changeShareLinkClicked: Dispatch<SetStateAction<boolean>>;
  changeLastClicked: Dispatch<SetStateAction<string>>;
  shareLinkAnimatingOut: boolean;
  copyShareLink?: string;
  path?: boolean;
}

const CopyLinkButton: FC<CopyLinkButtonProps> = ({
  shareLinkClicked,
  changeShareLinkClicked,
  changeLastClicked,
  shareLinkAnimatingOut,
  copyShareLink,
  path,
}) => {
  return (
    <li className="share_button_outer_container">
      <button
        className="share_button link_share_button"
        onClick={() => {
          if (copyShareLink) {
            handleShareLinkClicked(
              shareLinkClicked,
              changeShareLinkClicked,
              changeLastClicked,
              copyShareLink,
              path
            );
          }
        }}
      >
        {path ? (
          <IoFootstepsSharp className="link_share_button_icon" />
        ) : (
          <HiLink className="link_share_button_icon" />
        )}
        {shareLinkClicked && (
          <div
            className={`tooltip_container ${
              shareLinkAnimatingOut ? "tooltip_animating_out" : ""
            }`}
          >
            <div className="tooltip_outer_wrapper">
              <div className="tooltip_inner_wrapper">
                <IoIosCheckmarkCircle />
                <span>{path ? "Path" : "Link"} copied!</span>
              </div>
            </div>
          </div>
        )}
      </button>
    </li>
  );
};

export default CopyLinkButton;
