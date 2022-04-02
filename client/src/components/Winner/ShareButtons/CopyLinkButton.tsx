import { Dispatch, FC, SetStateAction } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { HiLink } from "react-icons/hi";

interface CopyLinkButtonProps {
  shareLinkClicked: boolean;
  changeShareLinkClicked: Dispatch<SetStateAction<boolean>>;
  shareLinkAnimatingOut: boolean;
  copyShareLink?: string;
}

const CopyLinkButton: FC<CopyLinkButtonProps> = ({
  shareLinkClicked,
  changeShareLinkClicked,
  shareLinkAnimatingOut,
  copyShareLink,
}) => {
  const handleShareLinkClicked = (shareLink: string) => {
    // Handle copy to clipboard
    const el = document.createElement("textarea");
    el.value = shareLink;
    el.setAttribute("readonly", "");
    el.setAttribute("style", "position: absolute; left: -9999px;");
    document.body.appendChild(el);

    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      // save current contentEditable/readOnly status
      let editable = el.contentEditable;
      let readOnly = el.readOnly;

      // convert to editable with readonly to stop iOS keyboard opening
      el.contentEditable = "true";
      el.readOnly = true;

      // create a selectable range
      let range = document.createRange();
      range.selectNodeContents(el);

      // select the range
      let selection = window.getSelection();

      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        el.setSelectionRange(0, 999999);

        // restore contentEditable/readOnly to original state
        el.contentEditable = editable;
        el.readOnly = readOnly;
      }
    } else {
      el.select();
    }

    document.execCommand("copy");
    document.body.removeChild(el);

    if (!shareLinkClicked) {
      changeShareLinkClicked(true);
    }
  };

  return (
    <li className="share_button_outer_container">
      <button
        className="share_button link_share_button"
        onClick={() => {
          if (copyShareLink) {
            handleShareLinkClicked(copyShareLink);
          }
        }}
      >
        <HiLink className="link_share_button_icon" />
        {shareLinkClicked && (
          <div
            className={`tooltip_container ${
              shareLinkAnimatingOut ? "tooltip_animating_out" : ""
            }`}
          >
            <div className="tooltip_outer_wrapper">
              <div className="tooltip_inner_wrapper">
                <IoIosCheckmarkCircle />
                <span>Link copied!</span>
              </div>
            </div>
          </div>
        )}
      </button>
    </li>
  );
};

export default CopyLinkButton;
