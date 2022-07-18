import React, { FC } from "react";
import { BsFillShareFill } from "react-icons/bs";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { handleShareLinkClicked } from "../handleShareLinkClicked";
import { CopyLinkButtonProps } from "../ShareButtons/CopyLinkButton";

export const ShareButton: FC<CopyLinkButtonProps> = ({
  shareLinkClicked,
  changeShareLinkClicked,
  changeLastClicked,
  shareLinkAnimatingOut,
  copyShareLink,
  path,
}) => {
  return (
    <div
      className="winner_kofi_button"
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
      <div className="btn-container share">
        <button className="kofi-button share share_button">
          <span className="kofitext">
            SHARE
            <BsFillShareFill className="kofiimg" size={23} />
          </span>
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
      </div>
    </div>
  );
};
